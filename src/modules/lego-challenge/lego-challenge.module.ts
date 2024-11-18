import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LegoChallengeController } from './lego-challenge.controller';
import { LegoBoxPiecesModule } from '../lego-box-pieces/lego-box-pieces.module';
import { LegoBoxesModule } from '../lego-boxes/lego-boxes.module';
import { NestedLegoBoxesModule } from '../nested-lego-boxes/nested-lego-boxes.module';

@Module({
  imports: [
    DatabaseModule,
    LegoBoxesModule,
    LegoBoxPiecesModule,
    NestedLegoBoxesModule,
  ],
  controllers: [LegoChallengeController],
})
export class LegoChallengeModule {}
