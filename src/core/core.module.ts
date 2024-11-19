import { Module, Global } from '@nestjs/common';
import { EventWaiterService } from './services/event-waiter.service';

@Global()
@Module({
  providers: [EventWaiterService],
  exports: [EventWaiterService],
})
export class CoreModule {}
