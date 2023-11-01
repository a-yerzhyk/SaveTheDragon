import { ENEMY, SECTION, ITEM } from '../config/config.js';
import { EnemyC } from '../types/types.js';

const suburbEnemies: Array<Omit<EnemyC, 'id'>> = [
  {
    type: ENEMY.SKELETON,
    inventory: [],
    movable: true,
    location: {
      section: SECTION.SUBURB,
      locationId: 3
    }
  },
  {
    type: ENEMY.SKELETON,
    inventory: [{ id: ITEM.BREAD, quantity: 1 }],
    movable: true,
    location: {
      section: SECTION.SUBURB,
      locationId: 4
    }
  },
  {
    type: ENEMY.GNOME,
    inventory: [],
    movable: true,
    location: {
      section: SECTION.SUBURB,
      locationId: 5
    }
  },
  {
    type: ENEMY.GNOME,
    inventory: [],
    movable: true,
    location: {
      section: SECTION.SUBURB,
      locationId: 10
    }
  },
  {
    type: ENEMY.GNOME,
    inventory: [{ id: ITEM.BREAD, quantity: 1 }],
    location: {
      section: SECTION.SUBURB,
      locationId: 8
    }
  },
  {
    type: ENEMY.GNOME,
    inventory: [{ id: ITEM.BREAD, quantity: 1 }],
    location: {
      section: SECTION.SUBURB,
      locationId: 12
    }
  },
]

const townEnemies: Array<Omit<EnemyC, 'id'>> = [
  {
    type: ENEMY.GNOME,
    inventory: [{ id: ITEM.BREAD, quantity: 1 }],
    location: {
      section: SECTION.TOWN,
      locationId: 1
    }
  },
  {
    type: ENEMY.GNOME,
    movable: true,
    inventory: [{ id: ITEM.POTION_OF_POWER, quantity: 1 }],
    location: {
      section: SECTION.TOWN,
      locationId: 2
    }
  },
  {
    type: ENEMY.GUARD,
    inventory: [],
    location: {
      section: SECTION.TOWN,
      locationId: 10
    }
  },
  {
    type: ENEMY.GUARD,
    inventory: [{ id: ITEM.POTION_OF_POWER, quantity: 1 }],
    location: {
      section: SECTION.TOWN,
      locationId: 10
    }
  },
  {
    type: ENEMY.GUARD,
    inventory: [],
    location: {
      section: SECTION.TOWN,
      locationId: 11
    }
  },
]

const castleEnemies: Array<Omit<EnemyC, 'id'>> = [
  {
    type: ENEMY.GUARD,
    inventory: [{ id: ITEM.POTION_OF_POWER, quantity: 1 }],
    location: {
      section: SECTION.CASTLE,
      locationId: 1
    }
  },
  {
    type: ENEMY.GUARD,
    movable: true,
    inventory: [{ id: ITEM.BREAD, quantity: 1 }],
    location: {
      section: SECTION.CASTLE,
      locationId: 9
    }
  },
  {
    type: ENEMY.GUARD,
    movable: true,
    inventory: [],
    location: {
      section: SECTION.CASTLE,
      locationId: 8
    }
  },
  {
    type: ENEMY.GUARD,
    movable: true,
    inventory: [],
    location: {
      section: SECTION.CASTLE,
      locationId: 8
    }
  },
  {
    type: ENEMY.PRINCESS,
    inventory: [],
    location: {
      section: SECTION.CASTLE,
      locationId: 11
    }
  },
]

export const ENEMIES: Array<EnemyC> = [
  ...suburbEnemies,
  ...townEnemies,
  ...castleEnemies
].map((e, index) => ({ id: index, ...e }))
