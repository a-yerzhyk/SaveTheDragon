import { ITEMS } from '../config/config.js';

export type InventoryArray = Array<{ id: ITEMS, quantity: number }>

export interface PersonConfig {
  readonly name: string;
  giveItem: (itemId: ITEMS, quantity?: number) => void;
  useItem: (itemId: ITEMS) => void;
  heal: (amount: number) => void;
  damage: (amount: number) => void;
  increaceStrength: (amount: number) => void;
}

export interface GameItemConfig {
  label: string;
  description: string;
  use: (hero: PersonConfig) => void;
}
export interface InventoryItem {
  item: GameItemConfig;
  quantity: number;
}

export type Inventory = Map<ITEMS, InventoryItem>;

export type Direction = 't' | 'r' | 'b' | 'l' | 'tr' | 'tl' | 'br' | 'bl';

export type LocationID = number;

export type LocationConnectionConfig = {
  locationID1: LocationID,
  locationID2: LocationID,
  direction: Direction,
}

export type LocationConfig = {
  id: LocationID,
  type: string,
  name: string,
}