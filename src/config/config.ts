export enum SECTION {
  SUBURB = 'SUBURB',
  TOWN = 'TOWN',
  CASTLE = 'CASTLE',
}

export enum ITEM {
  BREAD = 'Bread',
  POTION_OF_POWER = 'Potion of Power',
  JAIL_KEY = 'Jail Key',
}

export const ITEMS = {
  [ITEM.BREAD]: {
    heal: 10
  },
  [ITEM.POTION_OF_POWER]: {
    strength: 5
  }
}

export enum ENEMY {
  SKELETON = 'Skeleton',
  GNOME = 'Gnome',
  GUARD = 'Guard',
  PRINCESS = 'Princess',
}

export type HERO = 'Hero';

export const ENEMIES = {
  [ENEMY.SKELETON]: {
    name: ENEMY.SKELETON,
    health: 50,
    strength: 6,
  },
  [ENEMY.GNOME]: {
    name: ENEMY.GNOME,
    health: 100,
    strength: 10,
  },
  [ENEMY.GUARD]: {
    name: ENEMY.GUARD,
    health: 70,
    strength: 14,
  },
  [ENEMY.PRINCESS]: {
    name: ENEMY.PRINCESS,
    health: 200,
    strength: 30,
  },
} 
