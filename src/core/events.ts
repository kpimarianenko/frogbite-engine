export type EventCallback<T = unknown> = (payload: T) => void;
type EventMap = Map<string, Set<EventCallback>>;

export class EventBus {
  private eventMap: EventMap = new Map();

  subscribe(eventName: string, cb: EventCallback) {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, new Set());
    }

    this.eventMap.get(eventName)!.add(cb);
  }

  unsubscribe(eventName: string, cb: EventCallback) {
    const subscribers = this.eventMap.get(eventName);

    if (!subscribers) {
      return;
    }

    subscribers.delete(cb);

    if (!subscribers.size) {
      this.eventMap.delete(eventName);
    }
  }

  emit<T = unknown>(event: string, payload?: T) {
    const subscribers = this.eventMap.get(event);

    if (!subscribers) {
      return;
    }

    for (const cb of subscribers) {
      cb(payload);
    }
  }

  clear(eventName?: string) {
    if (eventName) {
      this.eventMap.delete(eventName);
    } else {
      this.eventMap.clear();
    }
  }
}
