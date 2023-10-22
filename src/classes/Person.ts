import { GameItemsFactory } from './GameItem.js'
import { ITEMS, ENEMY, ENEMIES } from '../config/config.js';
import {
  PersonID,
  InventoryArray,
  InventoryItem,
  Inventory,
  PersonConfig,
  HeroConfig,
  EnemyConfig,
  GameLocationConfig,
  Direction,
  LocationID
} from '../types/types.js';
import { getOppositeDirection } from '../utils/direction.js';

export default class Person implements PersonConfig {
  readonly id: PersonID;
  readonly name: string;
  private health: number;
  private strength: number;
  private readonly inventory: Inventory;
  currentLocation: GameLocationConfig | undefined;

  constructor (id: PersonID, name: string, health: number, strength: number, items: Inventory) {
    this.id = id;
    this.name = name;
    this.health = health;
    this.strength = strength;
    this.inventory = items;
  }

  getHealth() {
    return this.health;
  }

  getStrength() {
    return this.strength;
  }

  getInventory() {
    return this.inventory;
  }

  emptyInventory() {
    const inventory = this.inventory.map((value) => {
      return {
        itemId: value.item.type,
        quantity: value.quantity
      }
    })
    this.inventory.splice(0, this.inventory.length);
    return inventory;
  }

  giveItem(itemId: ITEMS, quantity: number = 1) {
    const inventoryItem = this.inventory.find(item => item.item.type === itemId)
    if (inventoryItem) {
      inventoryItem.quantity += quantity;
    } else {
      this.inventory.push({
        item: GameItemsFactory.createItem(itemId),
        quantity
      })
    }
  }

  useItem(itemId: ITEMS) {
    const inventoryItem = this.inventory.find(item => item.item.type === itemId);
    if (inventoryItem && inventoryItem.quantity) {
      inventoryItem.item.use(this);
      inventoryItem.quantity--;
      if (inventoryItem.quantity <= 0) {
        this.inventory.splice(this.inventory.indexOf(inventoryItem), 1);
      }
    } else {
      console.warn(`You do not have enought ${itemId}!`)
    }
  }

  heal(amount: number) {
    this.health += amount;
  }

  damage(amount: number) {
    if (this.health <= amount) {
      this.health = 0;
      return;
    }
    this.health -= amount;
  }

  increaceStrength(amount: number) {
    this.strength += amount;
  }
}

export class Enemy extends Person implements EnemyConfig {
  type: ENEMY;

  constructor(id: PersonID, inventory: InventoryArray, type: ENEMY) {
    const enemyConfig = ENEMIES[type]
    const enemyInventory = createInventory(inventory)
    super(id, enemyConfig.name, enemyConfig.health, enemyConfig.strength, enemyInventory);
    this.type = type;
  }

  moveRandomly() {
    const location = this.currentLocation
    if (!location) return
    const linkedLocations = location.linkedLocations
    const randomIndex = Math.floor(Math.random() * linkedLocations.length)
    const randomLocation = linkedLocations[randomIndex].location
    location.removePerson(this.id)
    randomLocation.addPerson(this)
    this.currentLocation = randomLocation
  }
}

export class Hero extends Person implements HeroConfig {
  currentLocationDirection: Direction = 'l';

  move (locationId: LocationID) {
    const location = this.currentLocation
    if (!location) return
    const enemiesCount = location?.personsOnLocation.size
    const linkedLocation = location.linkedLocations.find(linked => linked.location.id === locationId)
    if (!linkedLocation) return
    if (enemiesCount > 0 && linkedLocation.direction !== this.currentLocationDirection) {
      throw new Error('You cannot run away from the fight!')
    }
    this.currentLocation = linkedLocation.location
    this.currentLocationDirection = getOppositeDirection(linkedLocation.direction)
    return this.currentLocation
  }

  teleport (location: GameLocationConfig) {
    this.currentLocation = location
    this.currentLocationDirection = 'l'
  }
}

export class HeroBuilder {
  private id: PersonID;
  private name: string = '';
  private health: number = 0;
  private strength: number = 0;
  private inventory: Inventory = [];

  constructor(id: PersonID) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setHealth(health: number) {
    this.health = health;
    return this;
  }

  setStrength(strength: number) {
    this.strength = strength;
    return this;
  }

  setItems(inventory: InventoryArray) {
    this.inventory = createInventory(inventory);
    return this;
  }


  build() {
    return new Hero(this.id, this.name, this.health, this.strength, this.inventory);
  }
}

function createInventory (inventory: InventoryArray) {
  return inventory.map(item => {
    return { item: GameItemsFactory.createItem(item.id), quantity: item.quantity } as InventoryItem
  })
}
