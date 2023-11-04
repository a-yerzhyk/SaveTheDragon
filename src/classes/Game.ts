import {
  HeroConfig,
  EnemyConfig,
  GameMapConfig,
  LocationConfig,
  LocationConnectionConfig,
  LocationTeleportConfig,
  GameConfig,
  HeroC,
  EnemyC,
  Direction,
  LocationID,
} from "../types/types.js";
import { HeroBuilder, Enemy } from "./Person.js";
import { GameMapGenerator } from './GameMap.js'
import { SaveGame } from './SaveGame.js'

import { ITEM, SECTION } from '../config/config.js';
import { LOCATIONS, CONNECTIONS, TELEPORTS } from '../constants/locations.js';
import { HERO } from '../constants/hero.js';
import { ENEMIES } from '../constants/enemies.js';
import { EVENTS, EventsManager } from "./EventsManager.js";

export class Game {
  hero: HeroConfig
  enemies: EnemyConfig[]
  gameMaps: Map<SECTION, GameMapConfig>
  readonly daysToSave: number = 30
  private currentDay: number = 1

  constructor(hero: HeroConfig, enemies: EnemyConfig[], gameMaps: Map<SECTION, GameMapConfig>) {
    this.hero = hero
    this.enemies = enemies
    this.gameMaps = gameMaps
  }

  moveHero(direction: Direction) {
    const canMove = this.hero.canMove(direction)
    if (!canMove) return
    this.nextDay()
    this.enemies.forEach(enemy => {
      enemy.moveRandomly()
    })
    this.hero.move(direction)
  }

  getSection(section: SECTION) {
    return this.gameMaps.get(section)
  }

  getLocation(section: SECTION, locationId: LocationID) {
    return this.gameMaps.get(section)?.getLocation(locationId)
  }

  getCurrentDay() {
    return this.currentDay
  }

  saveGame() {
    return SaveGame.parseToConfig(this.hero, this.enemies)
  }

  saveTheDragon() {
    if (this.hero.hasItem(ITEM.JAIL_KEY)) {
      this.winGame()
    }
  }

  gameOver() {
    EventsManager.getInstance().emit(EVENTS.gameOver)
  }

  winGame() {
    EventsManager.getInstance().emit(EVENTS.gameWin)
  }

  private nextDay() {
    this.currentDay += 1
    if (this.currentDay >= this.daysToSave && this.hero.currentLocation?.type !== 'jail') {
      this.gameOver()
    }
  }
}

export class GameCreator {
  hero: HeroConfig
  enemies: EnemyConfig[]
  gameMaps: Map<SECTION, GameMapConfig>

  constructor(config?: Partial<GameConfig>) {
    const gameConfig: GameConfig = {
      ...defaultGameConfig,
      ...config,
    }
    this.gameMaps = this.createGameMaps(gameConfig.locations, gameConfig.locationConnections, gameConfig.sectionTeleports)
    this.hero = this.createHero(gameConfig.hero)
    this.enemies = this.createEnemies(gameConfig.enemies)
    this.setHeroLocation(gameConfig.hero.location.section, gameConfig.hero.location.locationId)
  }

  createGame() {
    return new Game(this.hero, this.enemies, this.gameMaps)
  }

  private createHero(heroConfig: HeroC): HeroConfig {
    const hero = new HeroBuilder(heroConfig.id)
      .setName(heroConfig.name)
      .setHealth(heroConfig.health)
      .setMaxHealth(heroConfig.maxHealth)
      .setStrength(heroConfig.strength)
      .setItems(heroConfig.inventory)
      .setDirection(heroConfig.location.direction)
      .build()
    return hero
  }

  private createEnemies(enemiesConfig: EnemyC[]): EnemyConfig[] {
    return enemiesConfig.map(enemyConfig => {
      const enemy = new Enemy(enemyConfig.id, enemyConfig.inventory, enemyConfig.type, enemyConfig.movable)
      this.setEnemyLocation(enemy, enemyConfig.location)
      return enemy
    })
  }

  private createGameMaps(
    locationsConfig: Record<SECTION, Array<LocationConfig>>,
    connectionsConfig: Record<SECTION, Array<LocationConnectionConfig>>,
    teleportsConfig: Array<LocationTeleportConfig>
  ): Map<SECTION, GameMapConfig> {
    const mapGenerator = new GameMapGenerator(locationsConfig, connectionsConfig, teleportsConfig)
    return mapGenerator.getGameMaps()
  }

  private setHeroLocation(section: SECTION, locationId: number) {
    this.hero.currentLocation = this.gameMaps.get(section)?.getLocation(locationId) ?? null
  }

  private setEnemyLocation(enemy: Enemy, locationConfig: EnemyC['location']) {
    const location = this.gameMaps.get(locationConfig.section)?.getLocation(locationConfig.locationId)
    if (!location) {
      throw new Error(`Location ${locationConfig.locationId} not found in section ${locationConfig.section}`)
    }
    location.addPerson(enemy)
    enemy.currentLocation = location
  }
}

const defaultGameConfig: GameConfig = {
  hero: HERO,
  enemies: ENEMIES,
  locations: LOCATIONS,
  locationConnections: CONNECTIONS,
  sectionTeleports: TELEPORTS,
}
