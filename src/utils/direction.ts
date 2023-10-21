import { Direction } from '../types/types.js';

export const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case 't': return 'b';
    case 'r': return 'l';
    case 'b': return 't';
    case 'l': return 'r';
    case 'tr': return 'bl';
    case 'tl': return 'br';
    case 'br': return 'tl';
    case 'bl': return 'tr';
  }
}