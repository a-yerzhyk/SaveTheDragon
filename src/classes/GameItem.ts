import { ITEM } from '../config/config.js';
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
    console.log(`You used the ${this.label} on ${hero.name}!`);
  }
}

export class Bread extends GameItem implements GameItemConfig {
  type: ITEM = ITEM.BREAD;
  private restoreHealth: number = 10;

  constructor() {
    super(ITEM.BREAD, 'A loaf of bread. Restores 10 health.');
  }

  use(hero: PersonConfig) {
    if (hero.getHealth() === hero.getMaxHealth()) {
      console.log('You are already at full health!');
      return;
    }
    super.use(hero);
    hero.heal(this.restoreHealth);
  }
}

export class PotionOfPower extends GameItem implements GameItemConfig {
  type: ITEM = ITEM.POTION_OF_POWER;

  constructor() {
    super(ITEM.POTION_OF_POWER, 'A potion of power. Increase strength by 5.');
  }

  use(hero: PersonConfig) {
    super.use(hero);
    hero.increaceStrength(5);
  }
}