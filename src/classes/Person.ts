import { GameItemsFactory } from './GameItem.js'
import { ITEM, ENEMY, HERO, ENEMIES } from '../config/config.js';
import {
  PersonID,
  InventoryArray,
  InventoryCell,
  Inventory,
  PersonConfig,
  HeroConfig,
  EnemyConfig,
  GameLocationConfig,
  Direction,
  LocationID
} from '../types/types.js';
import { getOppositeDirection } from '../utils/direction.js';
import { EventsManager, EVENTS } from './EventsManager.js';

export default abstract class Person implements PersonConfig {
  readonly id: PersonID;
  readonly name: string;
  private maxHealth: number;
  private health: number;
  private strength: number;
  private readonly inventory: Inventory;
  currentLocation: GameLocationConfig | undefined;
  type: ENEMY | HERO;

  constructor (id: PersonID, name: string, health: number, strength: number, items: Inventory, type: ENEMY | 'hero' = 'hero') {
    this.id = id;
    this.name = name;
    this.maxHealth = health;
    this.health = health;
    this.strength = strength;
    this.inventory = items;
    this.type = type;
  }

  getHealth() {
    return this.health;
  }

  getMaxHealth() {
    return this.maxHealth;
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

  giveItem(itemId: ITEM, quantity: number = 1) {
    const InventoryCell = this.inventory.find(item => item.item.type === itemId)
    if (InventoryCell) {
      InventoryCell.quantity += quantity;
    } else {
      this.inventory.push({
        item: GameItemsFactory.createItem(itemId),
        quantity
      })
    }
    EventsManager.getInstance().emit(EVENTS.giveItem, this.id, this.type, this.inventory)
  }

  useItem(itemId: ITEM) {
    const InventoryCell = this.inventory.find(item => item.item.type === itemId);
    if (InventoryCell && InventoryCell.quantity) {
      const isUsed = InventoryCell.item.use(this);
      if (!isUsed) return;
      InventoryCell.quantity--;
      if (InventoryCell.quantity <= 0) {
        this.inventory.splice(this.inventory.indexOf(InventoryCell), 1);
      }
      EventsManager.getInstance().emit(EVENTS.useItem, this.id, this.type, this.inventory)
    } else {
      console.warn(`You do not have enought ${itemId}!`)
    }
  }

  heal(amount: number) {
    this.health += amount;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
    EventsManager.getInstance().emit(EVENTS.heal, this.id, this.type, this.health)
  }

  damage(amount: number) {
    if (this.health <= amount) {
      this.health = 0;
    } else {
      this.health -= amount;
    }
    EventsManager.getInstance().emit(EVENTS.damage, this.id, this.type, this.health)
  }

  increaceStrength(amount: number) {
    this.strength += amount;
    EventsManager.getInstance().emit(EVENTS.increaceStrength, this.id, this.type, this.strength)
  }
}

export class Enemy extends Person implements EnemyConfig {
  constructor(id: PersonID, inventory: InventoryArray, type: ENEMY) {
    const enemyConfig = ENEMIES[type]
    const enemyInventory = createInventory(inventory)
    super(id, enemyConfig.name, enemyConfig.health, enemyConfig.strength, enemyInventory, type);
  }

  moveRandomly() {
    const location = this.currentLocation
    if (!location) return
    const linkedLocations = location.linkedLocations
    const wantToMove = Math.random() > 0.7
    if (!wantToMove) return
    const randomIndex = Math.floor(Math.random() * linkedLocations.length)
    const randomLocation = linkedLocations[randomIndex].location
    location.removePerson(this.id)
    randomLocation.addPerson(this)
    this.currentLocation = randomLocation
  }
}

export class Hero extends Person implements HeroConfig {
  currentDirection: Direction = 'l';

  canMove (locationId: LocationID) {
    const location = this.currentLocation
    if (!location) return false
    const enemiesCount = location?.personsOnLocation.size
    const linkedLocation = location.linkedLocations.find(linked => linked.location.id === locationId)
    if (!linkedLocation) return false
    if (enemiesCount > 0 && linkedLocation.direction !== this.currentDirection) {
      console.warn('Enemy is blocking your way!')
      return false
    }
    return true
  }

  move (locationId: LocationID) {
    const location = this.currentLocation
    if (!location) return
    const linkedLocation = location.linkedLocations.find(linked => linked.location.id === locationId)
    if (!linkedLocation) return

    this.currentLocation = linkedLocation.location
    this.currentDirection = getOppositeDirection(linkedLocation.direction)
    EventsManager.getInstance().emit(EVENTS.move, this.currentLocation, this.currentDirection)
  }

  teleport (location: GameLocationConfig) {
    if (this.currentLocation?.teleport?.location.id === location.id) {
      this.currentLocation = location
      this.currentDirection = location.teleport?.direction || 'l'
      EventsManager.getInstance().emit(EVENTS.move, this.currentLocation, this.currentDirection)
    }
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
    return { item: GameItemsFactory.createItem(item.id), quantity: item.quantity } as InventoryCell
  })
}
