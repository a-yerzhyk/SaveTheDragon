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

  isHeroAlive() {
    return this.hero.getHealth() > 0;
  }

  isEnemyAlive() {
    return this.enemy.getHealth() > 0;
  }

  protected hitEnemy(damageToEnemy: number) {
    console.group('damageToEnemy')
    console.log('damage', damageToEnemy)
    if (!damageToEnemy) return
    console.log('damage not returned', !damageToEnemy)
    const damage = this.randomizeDamage(damageToEnemy);
    console.log('randomized damage', damage)
    console.groupEnd()
    this.enemy.damage(damage);
    if (!this.isEnemyAlive() && this.isHeroAlive()) {
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

  protected wonBattle() {
    const enemyInventory = this.enemy.emptyInventory();
    enemyInventory.forEach((item) => {
      this.hero.giveItem(item.itemType, item.quantity);
    });
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
  readonly STEP_LIMIT = 6;
  private readonly NEW_NUMBER_INTERVAL = 800;
  private previous: number = 0;
  private current: number = 0;
  private battleInterval: NodeJS.Timeout | null = null;
  private stepsArray: Array<boolean> = [];
  private maxSteps: number;
  private battleTimer = new BattleTimer();

  constructor(game: Game, hero: HeroConfig, enemy: EnemyConfig) {
    super(game, hero, enemy);
    const heroStrength = hero.getStrength();
    const enemyStrength = enemy.getStrength();
    this.maxSteps = heroStrength > enemyStrength ? 2 : heroStrength === enemyStrength ? 3 : 4;
  }

  startRound() {
    this.battleTimer.startTimer(this.NEW_NUMBER_INTERVAL)
    this.startStep()
  }

  stopRound() {
    this.battleTimer.stopTimer()
    this.stopStep()
  }

  tryNumber(number: number) {
    if (!this.battleInterval) return
    const success = number === this.current;
    this.onStepEnd(success)
  }

  getCurrent () {
    return this.current;
  }

  maxStepsCount() {
    return this.maxSteps;
  }

  protected wonBattle() {
    this.battleTimer.stopTimer()
    this.stopRound();
    super.wonBattle();
  }

  protected lostBattle() {
    this.battleTimer.stopTimer()
    this.stopRound();
    super.lostBattle();
  }

  private startStep() {
    this.generateNewCurrentNumber()
    this.battleInterval = setInterval(() => {
      if (this.battleTimer.timer <= -1) {
        this.onRoundEnd()
      } else {
        this.generateNewCurrentNumber()
      }
    }, this.NEW_NUMBER_INTERVAL)
  }

  private stopStep() {
    if (this.battleInterval) {
      clearInterval(this.battleInterval);
      this.battleInterval = null;
    }
  }

  private restartStep() {
    this.stopStep()
    this.startStep()
  }

  private onStepEnd(step: boolean) {
    this.addStep(step)
    if (this.stepsArray.length === this.maxSteps) {
      this.onRoundEnd()
    } else {
      this.restartStep()
    }
  }

  private onRoundEnd() {
    this.stopRound()
    const successCount = this.stepsArray.filter(step => step).length;
    console.group('onRoundEnd')
    console.log('this.stepsArray', this.stepsArray)
    console.log('successCount', successCount)
    const failCount = this.maxSteps - successCount;
    console.log('failCount', failCount)
    const damageToEnemy = this.calcDamage(successCount, this.hero.getStrength());
    const damageToHero = this.calcDamage(failCount, this.enemy.getStrength());
    console.log('damageToEnemy', damageToEnemy)
    console.log('damageToHero', damageToHero)
    console.groupEnd()
    this.hitHero(damageToHero);
    this.hitEnemy(damageToEnemy);
    this.stepsArray = [];
    EventsManager.getInstance().emit(EVENTS.battleRoundEnd)
  }

  private calcDamage(count: number, damage: number) {
    return count === 0 ? 0 : Math.floor(damage + damage * count / 3)
  }

  private generateNewCurrentNumber() {
    const newCurrent = this.getNumber()
    this.updateCurrent(newCurrent)
  }

  private updateCurrent (newCurrent: number) {
    this.current = newCurrent;
    EventsManager.getInstance().emit(EVENTS.battleCurrentNumber, newCurrent)
  }

  private addStep(step: boolean) {
    this.stepsArray.push(step)
    EventsManager.getInstance().emit(EVENTS.battleStep, step)
  }

  private getNumber() {
    do {
      this.current = Math.floor(Math.random() * 10);
    } while (this.previous === this.current);
    this.previous = this.current;
    return this.current;
  }
}

class BattleTimer {
  readonly TIMER_LIMIT = 6;
  timer = this.TIMER_LIMIT;
  private timerInterval: NodeJS.Timeout | null = null;

  startTimer(interval: number) {
    this.resetStepLimitTimer()
    if (this.timerInterval) {
      this.stopTimer()
    }
    this.timerInterval = setInterval(() => {
      if (this.timer <= -1) {
        this.stopTimer()
      } else {
        this.updateStepLimitTimer()
      }
    }, interval)
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateStepLimitTimer() {
    this.timer--
    EventsManager.getInstance().emit(EVENTS.battleTimer, this.timer)
  }
  
  private resetStepLimitTimer() {
    this.timer = this.TIMER_LIMIT
    EventsManager.getInstance().emit(EVENTS.battleTimer, this.timer)
  }
}
