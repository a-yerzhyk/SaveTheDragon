export enum SECTION {
  SUBURB = 'SUBURB',
  TOWN = 'TOWN',
  CASTLE = 'CASTLE',
}

export enum ITEMS {
  BREAD = 'Bread',
  POTION_OF_POWER = 'Potion of Power',
}

export enum ENEMY {
  SKELETON = 'skeleton',
  GNOME = 'gnome',
  GUARD = 'guard',
}

export const ENEMIES = {
  [ENEMY.SKELETON]: {
    name: ENEMY.SKELETON,
    health: 50,
    strength: 4,
  },
  [ENEMY.GNOME]: {
    name: ENEMY.GNOME,
    health: 120,
    strength: 6,
  },
  [ENEMY.GUARD]: {
    name: ENEMY.GUARD,
    health: 90,
    strength: 8,
  },
} 
