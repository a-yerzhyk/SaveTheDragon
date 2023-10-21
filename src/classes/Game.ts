import {
  PersonConfig,
  GameMapConfig,
  LocationConfig,
  LocationConnectionConfig,
  GameConfig,
  HeroC,
  EnemyC,
} from "../types/types.js";
import { HeroBuilder, Enemy } from "./Person.js";
import { GameMapGenerator } from './GameMap.js'
import { SECTION } from '../config/config.js';

export class Game {
  hero: PersonConfig
  enemies: PersonConfig[]
  gameMaps: Map<SECTION, GameMapConfig>

  constructor(config: GameConfig) {
    this.hero = this.createHero(config.hero)
    this.enemies = this.createEnemies(config.enemies)
    this.gameMaps = this.createGameMaps(config.locations, config.locationConnections)
    this.setHeroLocation(config.hero.location.section, config.hero.location.locationId)
  }

  private createHero(heroConfig: HeroC): PersonConfig {
    const hero = new HeroBuilder(heroConfig.id)
      .setName(heroConfig.name)
      .setHealth(heroConfig.health)
      .setStrength(heroConfig.strength)
      .setItems(heroConfig.inventory)
      .build()
    return hero
  }

  private createEnemies(enemiesConfig: EnemyC[]): PersonConfig[] {
    return enemiesConfig.map(enemyConfig => {
      const enemy = new Enemy(enemyConfig.id, enemyConfig.inventory, enemyConfig.type)
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

  // private setEnemiesLocation(enemies: EnemyC[]) {
  //   enemies.forEach(enemy => {
  //      = this.gameMaps.get(enemy.location.section)?.getLocation(enemy.location.locationId)
  //   })
  // }
}
