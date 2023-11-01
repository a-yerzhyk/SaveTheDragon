import { ITEM, ITEMS } from '../config/config.js';
import { GameItemConfig, AbstractGameItemConfig, PersonConfig } from '../types/types.js';

export class GameItemsFactory {
  static createItem(item: ITEM) {
    switch (item) {
      case ITEM.BREAD:
        return new Bread();
      case ITEM.POTION_OF_POWER:
        return new PotionOfPower();
      default:
        throw new Error(`Item ${item} does not exist!`);
    }
  }
}

export default class GameItem implements AbstractGameItemConfig {
  label: string;
  description: string;

  constructor(label: string, description: string) {
    this.label = label;
    this.description = description;
  }

  use(hero: PersonConfig) {
    console.info(`You have used the ${this.label}!`);
    return true
  }
}

export class Bread extends GameItem implements GameItemConfig {
  type: ITEM = ITEM.BREAD;
  private restoreHealth: number = ITEMS[ITEM.BREAD].heal;

  constructor() {
    super(ITEM.BREAD, `A loaf of bread. Restores ${ITEMS[ITEM.BREAD].heal} health.`);
  }

  use(hero: PersonConfig) {
    if (hero.getHealth() === hero.getMaxHealth()) {
      console.warn('You are already at full health!');
      return false;
    }
    super.use(hero);
    hero.heal(this.restoreHealth);
    return true;
  }
}

export class PotionOfPower extends GameItem implements GameItemConfig {
  type: ITEM = ITEM.POTION_OF_POWER;
  private increaseStrength: number = ITEMS[ITEM.POTION_OF_POWER].strength;

  constructor() {
    super(ITEM.POTION_OF_POWER, `A potion of power. Increase strength by ${ITEMS[ITEM.POTION_OF_POWER].strength}.`);
  }

  use(hero: PersonConfig) {
    super.use(hero);
    hero.increaceStrength(this.increaseStrength);
    return true
  }
}

export class JailKey extends GameItem implements GameItemConfig {
  type: ITEM = ITEM.JAIL_KEY;

  constructor() {
    super(ITEM.JAIL_KEY, `Key to the jail.`);
  }

  use() {
    return true
  }
}
