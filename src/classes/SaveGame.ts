import { ENEMY, SECTION } from '@/index.js';
import { HeroConfig, EnemyConfig, HeroC, EnemyC, LocationID } from '../types/types.js';

export class SaveGame {
  private static saveHero(hero: HeroConfig): HeroC {
    const heroConfig = {
      id: hero.id,
      name: hero.name,
      health: hero.getHealth(),
      maxHealth: hero.getMaxHealth(),
      strength: hero.getStrength(),
      inventory: hero.getInventory().map(item => {
        return {
          id: item.item.type,
          quantity: item.quantity,
        }
      }),
      location: {
        section: hero.currentLocation?.section as SECTION,
        locationId: hero.currentLocation?.id as LocationID,
        direction: hero.getDirection(),
      },
    }
    return heroConfig
  }

  private static saveEnemies(enemies: EnemyConfig[]): EnemyC[] {
    const enemiesConfig = enemies.map(enemy => {
      return {
        id: enemy.id,
        type: enemy.type as ENEMY,
        inventory: enemy.getInventory().map(item => {
          return {
            id: item.item.type,
            quantity: item.quantity,
          }
        }),
        movable: enemy.movable,
        location: {
          section: enemy.currentLocation?.section as SECTION,
          locationId: enemy.currentLocation?.id as LocationID,
        }
      }
    })
    return enemiesConfig
  }

  static parseToConfig(hero: HeroConfig, enemies: EnemyConfig[]) {
    const heroConfig = this.saveHero(hero)
    const enemiesConfig = this.saveEnemies(enemies)
    return { hero: heroConfig, enemies: enemiesConfig }
  }
}
