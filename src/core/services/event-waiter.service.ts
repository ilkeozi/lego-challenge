import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventWaiterService implements OnModuleDestroy {
  private pendingEvents: Map<string, () => void> = new Map();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emits an event and waits for a specific response.
   * @param emitEvent - The event to emit.
   * @param emitPayload - The payload for the emitted event.
   * @param listenEvent - The event to listen for the response.
   * @param listenFilter - A function to filter the response.
   * @param timeout - Timeout in milliseconds.
   */
  async emitAndWait<T>(
    emitEvent: string,
    emitPayload: any,
    listenEvent: string,
    listenFilter: (payload: T) => boolean,
    timeout = 5000,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const listener = (payload: T) => {
        if (listenFilter(payload)) {
          resolve(payload);
          this.eventEmitter.off(listenEvent, listener);
          this.pendingEvents.delete(listenEvent);
        }
      };

      // Add listener for the response event
      this.eventEmitter.on(listenEvent, listener);
      this.pendingEvents.set(listenEvent, () => {
        this.eventEmitter.off(listenEvent, listener);
        reject(new Error(`Timeout waiting for event: ${listenEvent}`));
      });

      // Emit the event
      this.eventEmitter.emit(emitEvent, emitPayload);

      // Set up timeout to reject if the response isn't received
      setTimeout(() => {
        if (this.pendingEvents.has(listenEvent)) {
          this.pendingEvents.get(listenEvent)!();
        }
      }, timeout);
    });
  }

  /**
   * Cleans up any remaining event listeners on module destroy.
   */
  onModuleDestroy() {
    for (const cleanup of this.pendingEvents.values()) {
      cleanup();
    }
    this.pendingEvents.clear();
  }
}
