import { LocationID, LocationConfig, LocationConnectionConfig, Direction } from '../types/types.js';
import { SECTION } from '../config/config.js';

const getOppositeDirection = (direction: Direction): Direction => {
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

export class GameMapGenerator {
  gameMaps: Map<SECTION, GameMap>;
  maps: Map<SECTION, GameLocation[]>;
  
  constructor(mapConfigs: Record<SECTION, Array<LocationConfig>>) {
    this.gameMaps = new Map<SECTION, GameMap>()
    this.maps = new Map<SECTION, GameLocation[]>()
    for (let key in mapConfigs) {
        const sectionKey = key as SECTION
        const map = this.createLocations(mapConfigs[sectionKey])
        this.maps.set(sectionKey, map)
    }
  }

  createLocations(config: Array<LocationConfig>): GameLocation[] {
    return config.map(locationConfig => {
      const location = new GameLocation(locationConfig);
      return location;
    })
  }

  createGameMap() {
    this.maps.forEach((locations, key) => {
      const map = new GameMap();
      locations.forEach(location => {
        map.addLocation(location);
      })
      this.gameMaps.set(key, map);
    })
  }

  createConnections(connectionsConfig: Record<SECTION, Array<LocationConnectionConfig>>) {
    console.log('connectionsConfig:', connectionsConfig)
    // TODO: create map connections
  }
}

export class GameMap {
  locations: Map<LocationID, GameLocation>;

  constructor () {
    this.locations = new Map<LocationID, GameLocation>()
  }

  addLocation(location: GameLocation) {
    this.locations.set(location.id, location);
  }

  addPath(location1Id: LocationID, location2Id: LocationID, direction: Direction) {
    const location1 = this.locations.get(location1Id)
    const location2 = this.locations.get(location2Id)
    if (location1 && location2) {
      location1.link(location2, direction);
      location2.link(location1, getOppositeDirection(direction));
    }
  }

  getLocation(id: LocationID) {
    return this.locations.get(id);
  }
}

export class GameLocation {
  id: LocationID;
  type: string;
  name: string;

  linkedLocations: Array<{location: GameLocation, direction: Direction }> = [];

  constructor({ id, name, type }: LocationConfig) {
    this.id = id;
    this.name = name;
    this.type = type;
  }

  link (location: GameLocation, direction: Direction) {
    this.linkedLocations.push({ location, direction });
  }
}


