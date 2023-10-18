import { GameItemsFactory } from './GameItem.js'
import { ITEMS } from '../config/config.js';
import {
  InventoryArray,
  InventoryItem,
  Inventory,
  PersonConfig
} from '../types/types.js';

export default class Person implements PersonConfig {
  readonly name: string;
  private health: number;
  private strength: number;
  private readonly inventory: Inventory;

  constructor (name: string, health: number, strength: number, items: InventoryArray) {
    this.name = name;
    this.health = health;
    this.strength = strength;
    const inventoryArray: Array<[ITEMS, InventoryItem]> = [
      ...items.map(item => {
        return [
          item.id,
          { item: GameItemsFactory.createItem(item.id), quantity: item.quantity } as InventoryItem
        ] as [ITEMS, InventoryItem]
      })
    ]
    this.inventory = new Map(inventoryArray);
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

  giveItem(itemId: ITEMS, quantity: number = 1) {
    const inventoryItem = this.inventory.get(itemId)
    if (inventoryItem) {
      inventoryItem.quantity += quantity;
    } else {
      this.inventory.set(itemId, {
        item: GameItemsFactory.createItem(itemId),
        quantity
      })
    }
  }

  useItem(itemId: ITEMS) {
    const inventoryItem = this.inventory.get(itemId);
    if (inventoryItem && inventoryItem.quantity) {
      inventoryItem.item.use(this);
      inventoryItem.quantity--;
    } else {
      console.log(`You do not have enought ${itemId}!`)
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

export class PersonBuilder {
  name: string = '';
  health: number = 0;
  strength: number = 0;
  inventory: InventoryArray = [];

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
    this.inventory = inventory;
    return this;
  }


  build() {
    return new Person(this.name, this.health, this.strength, this.inventory);
  }
}
