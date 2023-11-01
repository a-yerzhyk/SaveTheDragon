import { ITEM, ENEMY, SECTION, HERO } from '../config/config.js';

export type InventoryArray = Array<{ id: ITEM, quantity: number }>

export type PersonID = number;
export type LocationID = number;
export interface PersonConfig {
  readonly id: PersonID;
  readonly name: string;
  currentLocation: GameLocationConfig | null;
  type: ENEMY | HERO,
  getHealth: () => number;
  getStrength: () => number;
  getMaxHealth: () => number;
  getInventory: () => Inventory;
  emptyInventory: () => { itemType: ITEM; quantity: number; }[];
  giveItem: (itemId: ITEM, quantity?: number) => void;
  hasItem: (itemId: ITEM) => boolean;
  useItem: (itemId: ITEM) => void;
  heal: (amount: number) => void;
  damage: (amount: number) => void;
  increaceStrength: (amount: number) => void;
}

export interface HeroConfig extends PersonConfig {
  canMove: (direction: Direction) => boolean;
  move: (direction: Direction) => void;
  teleport: (locationId: LocationID) => void;
}

export interface EnemyConfig extends PersonConfig {
  moveRandomly: () => void;
}

export interface AbstractGameItemConfig {
  label: string;
  description: string;
  use: (hero: PersonConfig) => boolean;
}
export interface GameItemConfig extends AbstractGameItemConfig {
  type: ITEM;
}
export interface InventoryCell {
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
  teleport: { location: GameLocationConfig, direction: Direction } | null;
  addPerson: (person: PersonConfig) => void;
  removePerson: (personId: PersonID) => PersonConfig | undefined;
  link: (location: GameLocationConfig, direction: Direction) => void;
  linkTeleport: (location: GameLocationConfig, direction: Direction) => void
}

interface GameMapBase {
  locations: Map<LocationID, GameLocationConfig>;
  section: SECTION;
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

export type Inventory = Array<InventoryCell>;

export type Direction = 't' | 'r' | 'b' | 'l' | 'tr' | 'tl' | 'br' | 'bl';

export type LocationConnectionConfig = {
  locationID1: LocationID;
  locationID2: LocationID;
  direction: Direction;
}

export type LocationTeleportConfig = {
  section1: SECTION;
  section2: SECTION;
  locationId1: LocationID;
  locationId2: LocationID;
  direction: Direction;
}

export type LocationConfig = {
  id: LocationID;
  type: string;
  name: string;
  teleportToSection?: {
    section: SECTION;
    locationId: LocationID;
    direction: Direction;
  }
}

// GAME CONFIG TYPES

export type HeroC = {
  id: PersonID,
  name: string,
  health: number,
  maxHealth: number,
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
  movable?: boolean,
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
  sectionTeleports: Array<LocationTeleportConfig>,
}
