import { ITEMS } from '../config/config.js';
import { GameItemConfig, PersonConfig } from '../types/types.js';

export class GameItemsFactory {
  static createItem(item: ITEMS) {
    switch (item) {
      case ITEMS.BREAD:
        return new Bread();
      case ITEMS.POTION_OF_POWER:
        return new PotionOfPower();
      default:
        throw new Error(`Item ${item} does not exist!`);
    }
  }
}

export default class GameItem implements GameItemConfig {
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
  constructor() {
    super(ITEMS.BREAD, 'A loaf of bread. Restores 10 health.');
  }

  use(hero: PersonConfig) {
    super.use(hero);
    hero.heal(10);
  }
}

export class PotionOfPower extends GameItem implements GameItemConfig {
  constructor() {
    super(ITEMS.POTION_OF_POWER, 'A potion of power. Increase strength by 5.');
  }

  use(hero: PersonConfig) {
    super.use(hero);
    hero.increaceStrength(5);
  }
}