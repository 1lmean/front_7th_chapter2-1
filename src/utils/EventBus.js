// src/utils/eventBus.js
const listeners = new Map(); // eventName → Set(handler)

export const eventBus = {
  on(event, handler) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event).add(handler);
    return () => this.off(event, handler);
  },
  off(event, handler) {
    const handlers = listeners.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) listeners.delete(event);
  },
  emit(event, payload) {
    const handlers = listeners.get(event);
    if (!handlers) return;
    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[eventBus] handler for "${event}" failed`, err);
      }
    });
  },
  clear() {
    listeners.clear();
  },
};
