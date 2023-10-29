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
    if (!damageToEnemy) return
    const damage = this.randomizeDamage(damageToEnemy);
    this.enemy.damage(damage);
    if (!this.isEnemyAlive()) {
      this.wonBattle()
    }
  }

  protected hitHero(damageToHero: number) {
    if (!damageToHero) return
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
  private battleInterval: NodeJS.Timeout | null = null;
  private stepsArray: Array<boolean> = [];
  private maxSteps: number;
  private stepLimitTimer = 0;
  readonly STEP_LIMIT = 6;

  constructor(game: Game, hero: HeroConfig, enemy: EnemyConfig) {
    super(game, hero, enemy);
    const heroStrength = hero.getStrength();
    const enemyStrength = enemy.getStrength();
    this.maxSteps = heroStrength > enemyStrength ? 2 : heroStrength === enemyStrength ? 3 : 4;
  }

  startRound() {
    this.battleInterval = setInterval(() => {
      if (this.stepLimitTimer <= 0) {
        this.updateStepsArray(false)
      } else {
        const newCurrent = this.getNumber()
        this.updateCurrent(newCurrent)
        this.updateStepLimitTimer()
      }
    }, this.NEW_NUMBER_INTERVAL)
  }

  tryNumber(number: number) {
    if (!this.battleInterval) return
    const success = number === this.current;
    this.updateStepsArray(success)
  }

  getCurrent () {
    return this.current;
  }

  stopRound() {
    if (this.battleInterval) {
      clearInterval(this.battleInterval);
      this.battleInterval = null;
    }
  }

  maxStepsCount() {
    return this.maxSteps;
  }

  protected wonBattle() {
    this.stopRound();
    super.wonBattle();
  }

  protected lostBattle() {
    this.stopRound();
    super.lostBattle();
  }

  private updateStepsArray(step: boolean) {
    this.stepsArray.push(step)
    this.resetStepLimitTimer()
    EventsManager.getInstance().emit(EVENTS.battleStep, step)
    if (this.stepsArray.length === this.maxSteps) {
      this.stopRound()
      this.calculateResult()
    }
  }

  private updateStepLimitTimer() {
    this.stepLimitTimer--
    EventsManager.getInstance().emit(EVENTS.battleStepTimer, this.stepLimitTimer)
  }
  
  private resetStepLimitTimer() {
    this.stepLimitTimer = this.STEP_LIMIT
    EventsManager.getInstance().emit(EVENTS.battleStepTimer, this.stepLimitTimer)
  }

  private calculateResult() {
    const stepsCount = this.stepsArray.filter(step => step).length;
    const failCount = this.stepsArray.filter(step => !step).length;
    const damageToEnemy = this.calcDamage(stepsCount, this.hero.getStrength());
    const damageToHero = this.calcDamage(failCount, this.enemy.getStrength());
    this.hitHero(damageToHero);
    this.hitEnemy(damageToEnemy);
    this.stepsArray = [];
    EventsManager.getInstance().emit(EVENTS.battleRoundEnd)
  }

  private calcDamage(count: number, damage: number) {
    return count === 0 ? 0 : Math.floor(damage + damage * count / 3)
  }

  private updateCurrent (newCurrent: number) {
    this.current = newCurrent;
    EventsManager.getInstance().emit(EVENTS.battleCurrentNumber, newCurrent)
  }

  private getNumber() {
    do {
      this.current = Math.floor(Math.random() * 10);
    } while (this.previous === this.current);
    this.previous = this.current;
    return this.current;
  }
}
