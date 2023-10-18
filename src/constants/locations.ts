import { LocationConnectionConfig, LocationConfig } from '../types/types.js'
import { SECTION } from '../config/config.js'

export const LOCATIONS: Record<SECTION, Array<LocationConfig>> = {
  [SECTION.SUBURB]: [
    {
      id: 1,
      type: 'entrance',
      name: 'вхід'
    },
    {
      id: 2,
      type: 'lawn',
      name: 'галявина'
    },
    {
      id: 3,
      type: 'lawn',
      name: 'галявина'
    },
    {
      id: 4,
      type: 'lawn',
      name: 'галявина'
    },
    {
      id: 5,
      type: 'lawn',
      name: 'галявина'
    },
    {
      id: 6,
      type: 'ippodrom',
      name: 'іподром'
    },
    {
      id: 7,
      type: 'molytovniy_dim',
      name: 'молитовний дім'
    },
    {
      id: 8,
      type: 'apple_garden',
      name: 'яблучний сад'
    },
    {
      id: 9,
      type: 'vineyard',
      name: 'виноградний сад'
    },
    {
      id: 10,
      type: 'cabbage_town',
      name: 'капустяний город'
    },
    {
      id: 11,
      type: 'pasture',
      name: 'пастбище'
    },
    {
      id: 12,
      type: 'farm',
      name: 'ферма'
    },
    {
      id: 13,
      type: 'town_entrance',
      name: 'вхід у місто'
    },
  ],
  [SECTION.TOWN]: [
    {
      id: 1,
      type: 'monument',
      name: 'пам\'ятник'
    },
    {
      id: 2,
      type: 'monument',
      name: 'пам\'ятник'
    },
    {
      id: 3,
      type: 'market',
      name: 'ринок'
    },
    {
      id: 4,
      type: 'market',
      name: 'ринок'
    },
    {
      id: 5,
      type: 'residential_area',
      name: 'хатинки'
    },
    {
      id: 6,
      type: 'residential_area',
      name: 'хатинки'
    },
    {
      id: 7,
      type: 'residential_area',
      name: 'хатинки'
    },
    {
      id: 8,
      type: 'residential_area',
      name: 'хатинки'
    },
    {
      id: 9,
      type: 'food storage',
      name: 'склад їжі'
    },
    {
      id: 10,
      type: 'arsenal',
      name: 'зброярня'
    },
    {
      id: 11,
      type: 'jail',
      name: 'тюрма'
    },
    {
      id: 12,
      type: 'amphitheatre',
      name: 'амфітеатр'
    },
    {
      id: 13,
      type: 'castle entrance',
      name: 'вхід у замок'
    },
  ],
  [SECTION.CASTLE]: [
    {
      id: 1,
      type: 'salon',
      name: 'вітальня'
    },
    {
      id: 2,
      type: 'corridor',
      name: 'коридор'
    },
    {
      id: 3,
      type: 'corridor',
      name: 'коридор'
    },
    {
      id: 4,
      type: 'corridor',
      name: 'коридор'
    },
    {
      id: 5,
      type: 'corridor',
      name: 'коридор'
    },
    {
      id: 6,
      type: 'corridor',
      name: 'коридор'
    },
    {
      id: 7,
      type: 'wardrobe',
      name: 'гардероб'
    },
    {
      id: 8,
      type: 'game_zone',
      name: 'ігрова зона'
    },
    {
      id: 9,
      type: 'dining_room',
      name: 'їдальня'
    },
    {
      id: 10,
      type: 'main_hall',
      name: 'головний зал'
    },
    {
      id: 11,
      type: 'throne_room',
      name: 'тронний зал'
    },
  ]
}

export const CONNECTIONS: Record<SECTION, Array<LocationConnectionConfig>> = {
  [SECTION.SUBURB]: [
    {
      locationID1: 1,
      locationID2: 2,
      direction: 'r',
    },
    {
      locationID1: 2,
      locationID2: 3,
      direction: 'tr',
    },
    {
      locationID1: 2,
      locationID2: 4,
      direction: 'r',
    },
    {
      locationID1: 2,
      locationID2: 10,
      direction: 'br',
    },
    {
      locationID1: 3,
      locationID2: 11,
      direction: 'r',
    },
    {
      locationID1: 3,
      locationID2: 4,
      direction: 'b',
    },
    {
      locationID1: 4,
      locationID2: 7,
      direction: 'r',
    },
    {
      locationID1: 4,
      locationID2: 10,
      direction: 'b',
    },
    {
      locationID1: 10,
      locationID2: 9,
      direction: 'r',
    },
    {
      locationID1: 11,
      locationID2: 12,
      direction: 'tr',
    },
    {
      locationID1: 11,
      locationID2: 6,
      direction: 'r',
    },
    {
      locationID1: 11,
      locationID2: 7,
      direction: 'b',
    },
    {
      locationID1: 7,
      locationID2: 5,
      direction: 'r',
    },
    {
      locationID1: 7,
      locationID2: 9,
      direction: 'b',
    },
    {
      locationID1: 9,
      locationID2: 8,
      direction: 'r',
    },
    {
      locationID1: 8,
      locationID2: 5,
      direction: 't',
    },
    {
      locationID1: 8,
      locationID2: 13,
      direction: 'tr',
    },
    {
      locationID1: 5,
      locationID2: 6,
      direction: 't',
    },
    {
      locationID1: 5,
      locationID2: 13,
      direction: 'r',
    },
    {
      locationID1: 6,
      locationID2: 12,
      direction: 't',
    },
    {
      locationID1: 6,
      locationID2: 13,
      direction: 'br',
    },
  ],
  [SECTION.TOWN]: [
    {
      locationID1: 1,
      locationID2: 5,
      direction: 'tr',
    },
    {
      locationID1: 1,
      locationID2: 3,
      direction: 'r',
    },
    {
      locationID1: 1,
      locationID2: 6,
      direction: 'br',
    },
    {
      locationID1: 5,
      locationID2: 7,
      direction: 'r',
    },
    {
      locationID1: 5,
      locationID2: 3,
      direction: 'b',
    },
    {
      locationID1: 3,
      locationID2: 2,
      direction: 'r',
    },
    {
      locationID1: 3,
      locationID2: 6,
      direction: 'b',
    },
    {
      locationID1: 6,
      locationID2: 8,
      direction: 'r',
    },
    {
      locationID1: 8,
      locationID2: 2,
      direction: 't',
    },
    {
      locationID1: 8,
      locationID2: 9,
      direction: 'r',
    },
    {
      locationID1: 8,
      locationID2: 10,
      direction: 'b',
    },
    {
      locationID1: 2,
      locationID2: 7,
      direction: 't',
    },
    {
      locationID1: 2,
      locationID2: 12,
      direction: 'r',
    },
    {
      locationID1: 7,
      locationID2: 11,
      direction: 't',
    },
    {
      locationID1: 7,
      locationID2: 4,
      direction: 'r',
    },
    {
      locationID1: 4,
      locationID2: 12,
      direction: 'b',
    },
    {
      locationID1: 12,
      locationID2: 13,
      direction: 'r',
    },
    {
      locationID1: 12,
      locationID2: 9,
      direction: 'b',
    },
  ],
  [SECTION.CASTLE]: [
    {
      locationID1: 1,
      locationID2: 2,
      direction: 'r',
    },
    {
      locationID1: 2,
      locationID2: 3,
      direction: 't',
    },
    {
      locationID1: 2,
      locationID2: 9,
      direction: 'r',
    },
    {
      locationID1: 2,
      locationID2: 4,
      direction: 'b',
    },
    {
      locationID1: 3,
      locationID2: 5,
      direction: 'r',
    },
    {
      locationID1: 4,
      locationID2: 6,
      direction: 'r',
    },
    {
      locationID1: 5,
      locationID2: 7,
      direction: 'r',
    },
    {
      locationID1: 5,
      locationID2: 9,
      direction: 'b',
    },
    {
      locationID1: 9,
      locationID2: 10,
      direction: 'r',
    },
    {
      locationID1: 9,
      locationID2: 6,
      direction: 'b',
    },
    {
      locationID1: 7,
      locationID2: 10,
      direction: 'b',
    },
    {
      locationID1: 10,
      locationID2: 11,
      direction: 'r',
    },
    {
      locationID1: 10,
      locationID2: 8,
      direction: 'b',
    },
    {
      locationID1: 6,
      locationID2: 8,
      direction: 'r',
    },
  ],
}