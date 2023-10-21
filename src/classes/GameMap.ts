import {
  LocationID,
  PersonID,
  LocationConfig,
  LocationConnectionConfig,
  Direction,
  GameLocationConfig,
  PersonConfig,
  GameMapGraphConfig,
  GameMapConfig
} from '../types/types.js';
import { SECTION } from '../config/config.js';
import { getOppositeDirection } from '../utils/direction.js';

export class GameMapGenerator {
  private gameMaps: Map<SECTION, GameMapConfig>;
  
  constructor(mapConfigs: Record<SECTION, Array<LocationConfig>>, connectionsConfigs: Record<SECTION, Array<LocationConnectionConfig>>) {
    this.gameMaps = new Map()

    for (let key in mapConfigs) {
      const sectionKey = key as SECTION
      const mapConfig = mapConfigs[sectionKey]
      const connectionsConfig = connectionsConfigs[sectionKey]
      const locations = this.createLocations(mapConfig)
      const gameMap = new GameMap()
      locations.forEach(location => {
        gameMap.addLocation(location)
      })
      connectionsConfig.forEach(connection => {
        gameMap.addPath(connection.locationID1, connection.locationID2, connection.direction)
      })
      this.gameMaps.set(sectionKey, gameMap)
    }
  }

  private createLocations(config: Array<LocationConfig>): GameLocationConfig[] {
    return config.map(locationConfig => {
      const location = new GameLocation(locationConfig);
      return location
    })
  }

  getGameMaps() {
    return this.gameMaps;
  }
}

export class GameMap implements GameMapConfig, GameMapGraphConfig {
  locations: Map<LocationID, GameLocationConfig>;

  constructor () {
    this.locations = new Map();
  }

  addLocation(location: GameLocationConfig) {
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

export class GameLocation implements GameLocationConfig {
  readonly id: LocationID;
  readonly type: string;
  readonly name: string;
  readonly linkedLocations: Array<{location: GameLocation, direction: Direction }> = [];
  readonly personsOnLocation: Map<PersonID, PersonConfig> = new Map<PersonID, PersonConfig>()

  constructor({ id, name, type }: LocationConfig) {
    this.id = id;
    this.name = name;
    this.type = type;
  }

  addPerson(person: PersonConfig) {
    this.personsOnLocation.set(person.id, person);
  }

  removePerson(personId: PersonID) {
    const personToRemove = this.personsOnLocation.get(personId);
    this.personsOnLocation.delete(personId);
    return personToRemove
  }

  link (location: GameLocationConfig, direction: Direction) {
    this.linkedLocations.push({ location, direction });
  }
}


