export enum SECTION {
  SUBURB = 'SUBURB',
  TOWN = 'TOWN',
  CASTLE = 'CASTLE',
}

export enum ITEM {
  BREAD = 'Bread',
  POTION_OF_POWER = 'Potion of Power',
}

export enum ENEMY {
  SKELETON = 'skeleton',
  GNOME = 'gnome',
  GUARD = 'guard',
}

export type HERO = 'hero';

export const ENEMIES = {
  [ENEMY.SKELETON]: {
    name: ENEMY.SKELETON,
    health: 50,
    strength: 6,
  },
  [ENEMY.GNOME]: {
    name: ENEMY.GNOME,
    health: 100,
    strength: 7,
  },
  [ENEMY.GUARD]: {
    name: ENEMY.GUARD,
    health: 70,
    strength: 14,
  },
} 
