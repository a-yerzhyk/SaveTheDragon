import { ITEM, SECTION } from '../config/config.js';
import { HeroC } from '../types/types.js';

export const HERO: HeroC = {
  id: 1,
  name: 'Hero',
  health: 100,
  strength: 10,
  inventory: [{
    id: ITEM.BREAD,
    quantity: 2
  }],
  location: {
    section: SECTION.SUBURB,
    locationId: 1  
  }
}
