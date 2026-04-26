// services/NotificationService.js
import { EventEmitter } from "events";

class NotificationService extends EventEmitter {
  static #instance = null;

  #subscribers;

  constructor() {
    if (NotificationService.#instance) {
      return NotificationService.#instance;
    }

    super();
    this.#subscribers = new Map();
    NotificationService.#instance = this;
  }

  static getInstance() {
    if (!NotificationService.#instance) {
      new NotificationService();
    }
    return NotificationService.#instance;
  }

  // --- Observer: subscribe ---
  subscribe(event, listenerId, callbackFn) {
    if (typeof callbackFn !== "function") {
      throw new Error(`Listener for "${event}" must be a function`);
    }

    // track by listenerId so we can unsubscribe later by name
    if (!this.#subscribers.has(event)) {
      this.#subscribers.set(event, new Map());
    }

    this.#subscribers.get(event).set(listenerId, callbackFn);
    this.on(event, callbackFn);

    console.log(
      `[NotificationService] "${listenerId}" subscribed to "${event}"`,
    );
  }

  // --- Observer: unsubscribe ---
  unsubscribe(event, listenerId) {
    const eventSubscribers = this.#subscribers.get(event);
    if (!eventSubscribers || !eventSubscribers.has(listenerId)) {
      console.warn(
        `[NotificationService] No subscriber "${listenerId}" found for "${event}"`,
      );
      return;
    }

    const callbackFn = eventSubscribers.get(listenerId);
    this.off(event, callbackFn);
    eventSubscribers.delete(listenerId);

    console.log(
      `[NotificationService] "${listenerId}" unsubscribed from "${event}"`,
    );
  }

  // --- Observer: notify / emit ---
  notify(event, payload) {
    const hasListeners = this.listenerCount(event) > 0;

    if (!hasListeners) {
      console.warn(`[NotificationService] No listeners for event "${event}"`);
      return;
    }

    console.log(`[NotificationService] Emitting "${event}"`, payload);
    this.emit(event, payload);
  }

  // --- convenience: list all active subscriptions ---
  getSubscriptions() {
    const result = {};
    for (const [event, listeners] of this.#subscribers.entries()) {
      result[event] = [...listeners.keys()];
    }
    return result;
  }
}

// --- system-wide events ---
export const EVENTS = {
  APPOINTMENT_CREATED: "appointment:created",
  APPOINTMENT_UPDATED: "appointment:updated",
  APPOINTMENT_CANCELLED: "appointment:cancelled",
  INVOICE_GENERATED: "invoice:generated",
  INVOICE_PAID: "invoice:paid",
  PET_REGISTERED: "pet:registered",
  OWNER_REGISTERED: "owner:registered",
};

export default NotificationService;
