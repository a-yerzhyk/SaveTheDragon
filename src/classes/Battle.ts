import { Game } from '../classes/Game.js';
import { HeroConfig, EnemyConfig } from '../types/types.js';
import { EventsManager, EVENTS } from './EventsManager.js';

class Battle {
  hero: HeroConfig;
  enemy: EnemyConfig;
  game: Game;

  constructor(game: Game, hero: HeroConfig, enemy: EnemyConfig) {
    this.hero = hero;
    this.enemy = enemy;
    this.game = game;
  }

  protected hitEnemy(damageToEnemy: number) {
    const damage = this.randomizeDamage(damageToEnemy);
    this.enemy.damage(damage);
    if (!this.isEnemyAlive()) {
      this.wonBattle()
    }
  }

  protected hitHero(damageToHero: number) {
    const damage = this.randomizeDamage(damageToHero);
    this.hero.damage(damage);
    if (!this.isHeroAlive()) {
      this.lostBattle()
    }
  }

  private isHeroAlive() {
    return this.hero.getHealth() >= 0;
  }

  private isEnemyAlive() {
    return this.enemy.getHealth() >= 0;
  }

  protected wonBattle() {
    EventsManager.getInstance().emit(EVENTS.battleWon)
  }

  protected lostBattle() {
    this.game.gameOver();
  }

  private randomizeDamage(damage: number) {
    const delta = Math.floor(Math.random() * 5);
    const sign = Math.random() > 0.5 ? 1 : -1;
    return damage + delta * sign;
  }
}


export class HitTheNumberBattle extends Battle {
  private readonly NEW_NUMBER_INTERVAL = 800;
  private previous: number = 0;
  private current: number = 0;
  private interval: NodeJS.Timeout | null = null;
  private successArray: Array<boolean> = [];
  private maxSuccess: number;

  constructor(game: Game, hero: HeroConfig, enemy: EnemyConfig) {
    super(game, hero, enemy);
    const heroStrength = hero.getStrength();
    const enemyStrength = enemy.getStrength();
    this.maxSuccess = heroStrength > enemyStrength ? 2 : heroStrength === enemyStrength ? 3 : 4;
  }

  startBattle() {
    this.interval = setInterval(() => {
      const newCurrent = this.getNumber()
      this.updateCurrent(newCurrent)
    }, this.NEW_NUMBER_INTERVAL)
  }

  tryNumber(number: number) {
    const success = number === this.current;
    this.updateSuccessArray(success)
  }

  protected wonBattle() {
    this.stopBattle();
    super.wonBattle();
  }

  protected lostBattle() {
    this.stopBattle();
    super.lostBattle();
  }

  private updateSuccessArray(success: boolean) {
    this.successArray.push(success)
    EventsManager.getInstance().emit(EVENTS.battleSuccess, success)
    if (this.successArray.length === this.maxSuccess) {
      this.stopBattle()
      this.calculateResult()
    }
  }

  private calculateResult() {
    const successCount = this.successArray.filter(success => success).length;
    const failCount = this.successArray.filter(success => !success).length;
    const damageToEnemy = this.calcDamage(successCount, this.hero.getStrength());
    const damageToHero = this.calcDamage(failCount, this.enemy.getStrength());
    this.hitHero(damageToHero);
    this.hitEnemy(damageToEnemy);
    this.successArray = [];
  }

  private calcDamage(count: number, damage: number) {
    return count === 0 ? 0 : Math.floor(damage + damage * count / 3)
  }

  private updateCurrent (newCurrent: number) {
    this.current = newCurrent;
    EventsManager.getInstance().emit(EVENTS.battleNumber, newCurrent)
  }

  private stopBattle() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private getNumber() {
    do {
      this.current = Math.floor(Math.random() * 10);
    } while (this.previous === this.current);
    this.previous = this.current;
    return this.current;
  }
}