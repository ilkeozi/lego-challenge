import { Test, TestingModule } from '@nestjs/testing';
import { EventWaiterService } from './event-waiter.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('EventWaiterService', () => {
  let service: EventWaiterService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEmitter2, EventWaiterService],
    }).compile();

    service = module.get<EventWaiterService>(EventWaiterService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('emitAndWait', () => {
    it('should resolve when the expected event is emitted', async () => {
      const emitEvent = 'test.emit';
      const listenEvent = 'test.response';
      const emitPayload = { key: 'value' };
      const expectedResponse = { success: true };

      // Mock event emission
      setTimeout(() => {
        eventEmitter.emit(listenEvent, expectedResponse);
      }, 100);

      const result = await service.emitAndWait(
        emitEvent,
        emitPayload,
        listenEvent,
        (payload: { success: boolean }) => payload.success === true,
        1000, // Timeout
      );

      expect(result).toEqual(expectedResponse);
    });

    it('should reject with a timeout error if the response is not received', async () => {
      const emitEvent = 'test.emit';
      const listenEvent = 'test.response';
      const emitPayload = { key: 'value' };

      await expect(
        service.emitAndWait(
          emitEvent,
          emitPayload,
          listenEvent,
          (payload: { success: boolean }) => payload.success === true,
          200, // Short timeout
        ),
      ).rejects.toThrow(`Timeout waiting for event: ${listenEvent}`);
    });

    it('should remove the listener after resolving', async () => {
      const emitEvent = 'test.emit';
      const listenEvent = 'test.response';
      const emitPayload = { key: 'value' };
      const expectedResponse = { success: true };

      // Mock event emission
      setTimeout(() => {
        eventEmitter.emit(listenEvent, expectedResponse);
      }, 100);

      const listenerSpy = jest.spyOn(eventEmitter, 'off');

      await service.emitAndWait(
        emitEvent,
        emitPayload,
        listenEvent,
        (payload: { success: boolean }) => payload.success === true,
        1000,
      );

      expect(listenerSpy).toHaveBeenCalledWith(
        listenEvent,
        expect.any(Function),
      );
    });

    it('should reject if the listener is removed before the response is received', async () => {
      const emitEvent = 'test.emit';
      const listenEvent = 'test.response';
      const emitPayload = { key: 'value' };

      setTimeout(() => {
        eventEmitter.emit(listenEvent, { success: true });
      }, 100);

      // Remove the listener manually
      setTimeout(() => {
        service['pendingEvents'].get(listenEvent)?.();
      }, 50);

      await expect(
        service.emitAndWait(
          emitEvent,
          emitPayload,
          listenEvent,
          (payload: { success: boolean }) => payload.success === true,
          1000,
        ),
      ).rejects.toThrow(`Timeout waiting for event: ${listenEvent}`);
    });
  });

  describe('onModuleDestroy', () => {
    it('should clear all pending listeners on module destroy', () => {
      const cleanupSpy = jest.fn();
      const listenEvent = 'test.response';

      service['pendingEvents'].set(listenEvent, cleanupSpy);

      service.onModuleDestroy();

      expect(cleanupSpy).toHaveBeenCalled();
      expect(service['pendingEvents'].size).toBe(0);
    });
  });
});
