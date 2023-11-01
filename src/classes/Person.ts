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
  currentLocation: GameLocationConfig | null = null;
  type: ENEMY | HERO;

  constructor (id: PersonID, name: string, health: number, maxHealth: number, strength: number, items: Inventory, type: ENEMY | 'hero' = 'hero') {
    this.id = id;
    this.name = name;
    this.maxHealth = maxHealth;
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
        itemType: value.item.type,
        quantity: value.quantity
      }
    })
    this.inventory.splice(0, this.inventory.length);
    return inventory;
  }

  hasItem(itemType: ITEM) {
    const InventoryCell = this.inventory.find(item => item.item.type === itemType)
    return !!InventoryCell?.quantity;
  }

  giveItem(itemType: ITEM, quantity: number = 1) {
    const InventoryCell = this.inventory.find(item => item.item.type === itemType)
    if (InventoryCell) {
      InventoryCell.quantity += quantity;
    } else {
      this.inventory.push({
        item: GameItemsFactory.createItem(itemType),
        quantity
      })
    }
    EventsManager.getInstance().emit(EVENTS.giveItem, this.id, this.type, this.inventory)
  }

  useItem(itemType: ITEM) {
    const InventoryCell = this.inventory.find(item => item.item.type === itemType);
    if (InventoryCell && InventoryCell.quantity) {
      const isUsed = InventoryCell.item.use(this);
      if (!isUsed) return;
      InventoryCell.quantity--;
      if (InventoryCell.quantity <= 0) {
        this.inventory.splice(this.inventory.indexOf(InventoryCell), 1);
      }
      EventsManager.getInstance().emit(EVENTS.useItem, this.id, this.type, this.inventory)
    } else {
      console.warn(`You do not have enought ${itemType}!`)
    }
  }

  heal(amount: number) {
    if (amount < 0) return
    this.health += amount;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
    EventsManager.getInstance().emit(EVENTS.heal, this.id, this.type, this.health)
  }

  damage(amount: number) {
    if (amount < 0) return
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
  readonly movable: boolean;

  constructor(id: PersonID, inventory: InventoryArray, type: ENEMY, movable: boolean = false) {
    const enemyConfig = ENEMIES[type]
    const enemyInventory = createInventory(inventory)
    super(id, enemyConfig.name, enemyConfig.health, enemyConfig.health, enemyConfig.strength, enemyInventory, type);
    this.movable = movable;
  }

  moveRandomly() {
    if (!this.movable) return
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

  damage(amount: number) {
    super.damage(amount)
    if (this.getHealth() <= 0) {
      this.kill()
    }
  }

  kill() {
    this.currentLocation?.removePerson(this.id)
    this.currentLocation = null
  }
}

export class Hero extends Person implements HeroConfig {
  private currentDirection: Direction;

  constructor (id: PersonID, name: string, health: number, maxHealth: number, strength: number, items: Inventory, direction: Direction) {
    super(id, name, health, maxHealth, strength, items)
    this.currentDirection = direction
  }

  getDirection () {
    return this.currentDirection
  }

  canMove (direction: Direction) {
    if (!this.currentLocation) return false
    const hasDirection = this.currentLocation.linkedLocations.some(linked => linked.direction === direction)
    if (!hasDirection) return false
    const enemiesCount = this.currentLocation.personsOnLocation.size
    if (enemiesCount > 0 && direction !== this.currentDirection) {
      console.warn('Enemy is blocking your way!')
      return false
    }
    return true
  }

  move (direction: Direction) {
    if (!this.currentLocation) return
    const target = this.currentLocation.linkedLocations.find(linked => linked.direction === direction)
    if (!target) return

    this.currentLocation = target.location
    this.setDirection(getOppositeDirection(target.direction))
    EventsManager.getInstance().emit(EVENTS.move, this.currentLocation, this.currentDirection)
  }

  teleport (locationId: LocationID) {
    // Check for enemies
    if (this.currentLocation?.teleport?.location.id === locationId) {
      const enemiesCount = this.currentLocation.personsOnLocation.size
      if (enemiesCount > 0 && this.currentLocation.teleport.direction !== this.currentDirection) {
        console.warn('Enemy is blocking your way!')
        return
      }
      const targetLocation = this.currentLocation.teleport.location
      this.currentLocation = targetLocation
      this.setDirection(targetLocation.teleport?.direction || 'l')
      EventsManager.getInstance().emit(EVENTS.move, this.currentLocation, this.currentDirection)
    }
  }

  private setDirection (direction: Direction) {
    this.currentDirection = direction
  }
}

export class HeroBuilder {
  private id: PersonID;
  private name: string = '';
  private health: number = 0;
  private maxHealth: number = 0;
  private strength: number = 0;
  private inventory: Inventory = [];
  private direction: Direction = 'l';

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

  setMaxHealth(health: number) {
    this.maxHealth = health;
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

  setDirection(direction: Direction) {
    this.direction = direction;
    return this;
  }

  build() {
    return new Hero(this.id, this.name, this.health, this.maxHealth, this.strength, this.inventory, this.direction);
  }
}

function createInventory (inventory: InventoryArray) {
  return inventory.map(item => {
    return { item: GameItemsFactory.createItem(item.id), quantity: item.quantity } as InventoryCell
  })
}
