export type Event = 'move'
  | 'giveItem'
  | 'useItem'
  | 'heal'
  | 'damage'
  | 'increaceStrength'
  | 'battleCurrentNumber'
  | 'battleStep'
  | 'battleStepTimer'
  | 'battleRoundEnd'
  | 'battleWon'
  | 'gameOver'

export const EVENTS: Record<Event, Event> = {
  move: 'move',
  giveItem: 'giveItem',
  useItem: 'useItem',
  heal: 'heal',
  damage: 'damage',
  increaceStrength: 'increaceStrength',
  battleCurrentNumber: 'battleCurrentNumber',
  battleStep: 'battleStep',
  battleStepTimer: 'battleStepTimer',
  battleRoundEnd: 'battleRoundEnd',
  battleWon: 'battleWon',
  gameOver: 'gameOver'
}

export class EventsManager {
  private listeners: Map<Event, Array<Function>> = new Map();
  private static instance: EventsManager;

  static getInstance() {
    if (EventsManager.instance) {
      return EventsManager.instance;
    }
    EventsManager.instance = new EventsManager();
    return EventsManager.instance;
  }

  subscribe(event: Event, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  unsubscribe(event: Event, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      this.listeners.set(event, eventListeners.filter(listener => listener !== callback));
    }
  }

  emit(event: Event, ...args: any[]) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(...args));
    }
  }
}