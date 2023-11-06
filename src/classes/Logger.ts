import { EVENTS, EventsManager } from "./EventsManager.js";

export class Logger {
  private static instance: Logger;
  
  static getInstance() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = new Logger();
    return Logger.instance;
  }

  log(message: string) {
    EventsManager.getInstance().emit(EVENTS.log, message)
  }
}
