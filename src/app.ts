import { HeroBuilder } from './classes/Person.js'
import { GameMapGenerator } from './classes/GameMap.js'
import { LOCATIONS, CONNECTIONS } from './constants/locations.js';
import { HERO } from './constants/hero.js';
import { ENEMIES } from './constants/enemies.js';
import { SECTION, ITEMS } from './config/config.js';

const gameConfig = {
  hero: HERO,
  enemies: ENEMIES,
  locations: LOCATIONS,
  locationConnections: CONNECTIONS,
}

function personTest () {
    const personBuilder = new HeroBuilder(1)
    const person = personBuilder
      .setName('John')
      .setHealth(100)
      .setStrength(10)
      .setItems([
        {id: ITEMS.BREAD, quantity: 1},
      ])
      .build()
  
    console.log('Created', person.name)
    console.log('Current health', person.getHealth())
    person.useItem(ITEMS.BREAD)
    person.useItem(ITEMS.BREAD)
    console.log('Current health', person.getHealth())
    
    console.log('Current strength', person.getStrength())
    person.useItem(ITEMS.POTION_OF_POWER)
    console.log('Current strength', person.getStrength())
    person.giveItem(ITEMS.POTION_OF_POWER, 2)
    person.useItem(ITEMS.POTION_OF_POWER)
    console.log('Current strength', person.getStrength())
    person.useItem(ITEMS.POTION_OF_POWER)
    console.log('Current strength', person.getStrength())
    person.useItem(ITEMS.POTION_OF_POWER)
    console.log('Current strength', person.getStrength())
}

function gameMapTest () {
  const mapGenerator = new GameMapGenerator(LOCATIONS, CONNECTIONS)
  // console.log(mapGenerator.maps.get(SECTION.SUBURB))
  // console.log(mapGenerator.maps.get(SECTION.TOWN))
  // console.log(mapGenerator.maps.get(SECTION.CASTLE))
  console.log(mapGenerator.getGameMaps().get(SECTION.SUBURB)?.getLocation(2))
}

function gameStart () {
  // personTest()
  gameMapTest()
}

gameStart()