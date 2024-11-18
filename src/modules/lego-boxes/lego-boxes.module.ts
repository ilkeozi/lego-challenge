import { Module } from '@nestjs/common';
import { LegoBoxesController } from './lego-boxes.controller';
import { LegoBoxesService } from './lego-boxes.service';
import { LegoBoxPiecesModule } from '../lego-box-pieces/lego-box-pieces.module';
import { NestedLegoBoxesModule } from '../nested-lego-boxes/nested-lego-boxes.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, LegoBoxPiecesModule, NestedLegoBoxesModule],
  controllers: [LegoBoxesController],
  providers: [LegoBoxesService],
  exports: [LegoBoxesService],
})
export class LegoBoxesModule {}
