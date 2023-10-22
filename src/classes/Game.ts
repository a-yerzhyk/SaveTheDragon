import {
  HeroConfig,
  EnemyConfig,
  GameMapConfig,
  LocationConfig,
  LocationConnectionConfig,
  GameConfig,
  HeroC,
  EnemyC,
  LocationID,
} from "../types/types.js";
import { HeroBuilder, Enemy } from "./Person.js";
import { GameMapGenerator } from './GameMap.js'

import { SECTION } from '../config/config.js';
import { LOCATIONS, CONNECTIONS } from '../constants/locations.js';
import { HERO } from '../constants/hero.js';
import { ENEMIES } from '../constants/enemies.js';

class Game {
  hero: HeroConfig
  enemies: EnemyConfig[]
  gameMaps: Map<SECTION, GameMapConfig>

  constructor(config: GameConfig) {
    this.gameMaps = this.createGameMaps(config.locations, config.locationConnections)
    this.hero = this.createHero(config.hero)
    this.enemies = this.createEnemies(config.enemies)
    this.setHeroLocation(config.hero.location.section, config.hero.location.locationId)
  }

  moveEnemies() {
    this.enemies.forEach(enemy => {
      enemy.moveRandomly()
    })
  }

  getSection(section: SECTION) {
    return this.gameMaps.get(section)
  }

  getLocation(section: SECTION, locationId: LocationID) {
    return this.gameMaps.get(section)?.getLocation(locationId)
  }

  private createHero(heroConfig: HeroC): HeroConfig {
    const hero = new HeroBuilder(heroConfig.id)
      .setName(heroConfig.name)
      .setHealth(heroConfig.health)
      .setStrength(heroConfig.strength)
      .setItems(heroConfig.inventory)
      .build()
    return hero
  }

  private createEnemies(enemiesConfig: EnemyC[]): EnemyConfig[] {
    return enemiesConfig.map(enemyConfig => {
      const enemy = new Enemy(enemyConfig.id, enemyConfig.inventory, enemyConfig.type)
      this.setEnemyLocation(enemy, enemyConfig.location)
      return enemy
    })
  }

  private createGameMaps(locationsConfig: Record<SECTION, Array<LocationConfig>>, connectionsConfig: Record<SECTION, Array<LocationConnectionConfig>>): Map<SECTION, GameMapConfig> {
    const mapGenerator = new GameMapGenerator(locationsConfig, connectionsConfig)
    return mapGenerator.getGameMaps()
  }

  private setHeroLocation(section: SECTION, locationId: number) {
    this.hero.currentLocation = this.gameMaps.get(section)?.getLocation(locationId)
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

export class GameCreator {
  createGame(config?: GameConfig) {
    const gameConfig = config || defaultGameConfig
    return new Game(gameConfig)
  }
}

const defaultGameConfig = {
  hero: HERO,
  enemies: ENEMIES,
  locations: LOCATIONS,
  locationConnections: CONNECTIONS,
}

export default Game