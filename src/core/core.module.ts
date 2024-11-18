import { Module, Global } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventWaiterService } from './services/event-waiter.service';

@Global()
@Module({
  providers: [
    EventWaiterService,
    {
      provide: EventEmitter2,
      useValue: new EventEmitter2(),
    },
  ],
  exports: [EventWaiterService],
})
export class CoreModule {}
