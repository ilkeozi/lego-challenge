import { Module } from '@nestjs/common';
import { LegoBoxPiecesService } from './lego-box-pieces.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [LegoBoxPiecesService],
  exports: [LegoBoxPiecesService],
})
export class LegoBoxPiecesModule {}
