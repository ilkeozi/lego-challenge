import { Module } from '@nestjs/common';
import { RedisService } from './infrastructure/redis/redis.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { LegoPiecesModule } from './modules/lego-pieces/lego-pieces.module';
import { LegoBoxesModule } from './modules/lego-boxes/lego-boxes.module';
import { LegoChallengeModule } from './modules/lego-challenge/lego-challenge.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LegoBoxPiecesModule } from './modules/lego-box-pieces/lego-box-pieces.module';
import { NestedLegoBoxesModule } from './modules/nested-lego-boxes/nested-lego-boxes.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DatabaseModule,
    CoreModule,
    LegoChallengeModule,
    LegoBoxesModule,
    LegoPiecesModule,
    PricingModule,
    LegoBoxPiecesModule,
    NestedLegoBoxesModule,
  ],
  providers: [RedisService],
})
export class AppModule {}
