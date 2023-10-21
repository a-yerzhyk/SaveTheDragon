import { ENEMY, SECTION, ITEMS } from '../config/config.js';
import { EnemyC } from '../types/types.js';

export const ENEMIES: EnemyC[] = [
  {
    id: 2,
    type: ENEMY.SKELETON,
    inventory: [],
    location: {
      section: SECTION.SUBURB,
      locationId: 3
    }
  },
  {
    id: 3,
    type: ENEMY.SKELETON,
    inventory: [],
    location: {
      section: SECTION.SUBURB,
      locationId: 4
    }
  },
  {
    id: 6,
    type: ENEMY.GNOME,
    inventory: [{ id: ITEMS.BREAD, quantity: 1 }],
    location: {
      section: SECTION.SUBURB,
      locationId: 5
    }
  },
  {
    id: 6,
    type: ENEMY.GUARD,
    inventory: [{ id: ITEMS.POTION_OF_POWER, quantity: 1 }],
    location: {
      section: SECTION.TOWN,
      locationId: 9
    }
  },
]
