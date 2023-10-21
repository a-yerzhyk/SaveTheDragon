import { ITEMS, ENEMY, SECTION } from '../config/config.js';

export type InventoryArray = Array<{ id: ITEMS, quantity: number }>

export type PersonID = number;
export type LocationID = number;
export interface PersonConfig {
  readonly id: PersonID;
  readonly name: string;
  currentLocation: GameLocationConfig | undefined;
  getHealth: () => number;
  getStrength: () => number;
  getInventory: () => Inventory;
  emptyInventory: () => { itemId: ITEMS; quantity: number; }[];
  giveItem: (itemId: ITEMS, quantity?: number) => void;
  useItem: (itemId: ITEMS) => void;
  heal: (amount: number) => void;
  damage: (amount: number) => void;
  increaceStrength: (amount: number) => void;
}

export interface HeroConfig extends PersonConfig {
  move: (locationId: LocationID) => void;
}

export interface EnemyConfig extends PersonConfig {
  moveRandomly: () => void;
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

export interface GameLocationConfig {
  id: LocationID;
  type: string;
  name: string;
  section: SECTION;
  linkedLocations: Array<{location: GameLocationConfig, direction: Direction }>;
  personsOnLocation: Map<PersonID, PersonConfig>;
  addPerson: (person: PersonConfig) => void;
  removePerson: (personId: PersonID) => PersonConfig | undefined;
  link: (location: GameLocationConfig, direction: Direction) => void;
}

interface GameMapBase {
  locations: Map<LocationID, GameLocationConfig>;
}

export interface GameMapGraphConfig extends GameMapBase {
  addLocation: (location: GameLocationConfig) => void;
  addPath: (location1Id: LocationID, location2Id: LocationID, direction: Direction) => void;
}

export interface GameMapConfig extends GameMapBase {
  getLocation: (id: LocationID) => GameLocationConfig | undefined;
}

export interface GameActionPersonActionsConfig {
  killPerson: (person: PersonConfig) => void;
}

export interface GameActionMovableConfig {
  moveAllPersons: () => void
}

export interface GameActionManagerConfig extends GameActionPersonActionsConfig, GameActionMovableConfig {}

export type Inventory = Map<ITEMS, InventoryItem>;

export type Direction = 't' | 'r' | 'b' | 'l' | 'tr' | 'tl' | 'br' | 'bl';

export type LocationConnectionConfig = {
  locationID1: LocationID;
  locationID2: LocationID;
  direction: Direction;
}

export type LocationConfig = {
  id: LocationID;
  type: string;
  name: string;
}

// GAME CONFIG TYPES

export type HeroC = {
  id: PersonID,
  name: string,
  health: number,
  strength: number,
  inventory: InventoryArray,
  location: {
    section: SECTION,
    locationId: LocationID
  },
}

export type EnemyC = {
  id: PersonID,
  type: ENEMY,
  inventory: InventoryArray,
  location: {
    section: SECTION,
    locationId: LocationID
  },
}

export type GameConfig = {
  hero: HeroC,
  enemies: EnemyC[],
  locations: Record<SECTION, Array<LocationConfig>>,
  locationConnections: Record<SECTION, Array<LocationConnectionConfig>>,
}
