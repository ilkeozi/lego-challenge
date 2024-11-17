import { Module } from '@nestjs/common';
import { RedisService } from './infrastructure/redis/redis.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { LegoPiecesModule } from './modules/lego-pieces/lego-pieces.module';
import { LegoBoxesModule } from './modules/lego-boxes/lego-boxes.module';
import { LegoBoxComponentsModule } from './modules/lego-box-components/lego-box-components.module';

@Module({
  imports: [
    DatabaseModule,
    LegoBoxesModule,
    LegoBoxComponentsModule,
    LegoPiecesModule,
  ],
  providers: [RedisService],
})
export class AppModule {}
