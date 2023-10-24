import {
  LocationID,
  PersonID,
  LocationConfig,
  LocationConnectionConfig,
  Direction,
  GameLocationConfig,
  PersonConfig,
  GameMapGraphConfig,
  LocationTeleportConfig,
  GameMapConfig
} from '../types/types.js';
import { SECTION } from '../config/config.js';
import { getOppositeDirection } from '../utils/direction.js';

export class GameMapGenerator {
  private gameMaps: Map<SECTION, GameMapConfig>;
  
  constructor(
    mapConfigs: Record<SECTION, Array<LocationConfig>>,
    connectionsConfigs: Record<SECTION, Array<LocationConnectionConfig>>,
    teleportConfigs: Array<LocationTeleportConfig>
  ) {
    this.gameMaps = new Map()

    for (let key in mapConfigs) {
      const sectionKey = key as SECTION
      const mapConfig = mapConfigs[sectionKey]
      const connectionsConfig = connectionsConfigs[sectionKey]
      const locations = this.createLocations(mapConfig, sectionKey)
      const gameMap = new GameMap(sectionKey)
      locations.forEach(location => {
        gameMap.addLocation(location)
      })
      connectionsConfig.forEach(connection => {
        gameMap.addPath(connection.locationID1, connection.locationID2, connection.direction)
      })
      this.gameMaps.set(sectionKey, gameMap)
      this.createTeleports(teleportConfigs)
    }
  }

  private createLocations(config: Array<LocationConfig>, section: SECTION): GameLocationConfig[] {
    return config.map(locationConfig => {
      const location = new GameLocation(locationConfig, section);
      return location
    })
  }

  private createTeleports(config: Array<LocationTeleportConfig>) {
    for (let teleportConfig of config) {
      const { section1, section2, locationId1, locationId2, direction } = teleportConfig
      const location1 = this.gameMaps.get(section1)?.getLocation(locationId1)
      const location2 = this.gameMaps.get(section2)?.getLocation(locationId2)
      if (location1 && location2) {
        location1.linkTeleport(location2, direction)
        location2.linkTeleport(location1, getOppositeDirection(direction))
      }
    }
  }

  getGameMaps() {
    return this.gameMaps;
  }
}

export class GameMap implements GameMapConfig, GameMapGraphConfig {
  locations: Map<LocationID, GameLocationConfig>;
  section: SECTION;

  constructor (section: SECTION) {
    this.locations = new Map();
    this.section = section;
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
  readonly section: SECTION;
  readonly linkedLocations: Array<{location: GameLocationConfig, direction: Direction }> = [];
  readonly personsOnLocation: Map<PersonID, PersonConfig> = new Map<PersonID, PersonConfig>()
  teleport: { location: GameLocationConfig, direction: Direction } | null = null

  constructor({ id, name, type }: LocationConfig, section: SECTION) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.section = section;
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

  linkTeleport (location: GameLocationConfig, direction: Direction) {
    this.teleport = { location, direction }
  }
}


