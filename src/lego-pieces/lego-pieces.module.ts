import { Module } from '@nestjs/common';
import { LegoPiecesService } from './lego-pieces.service';
import { LegoPiecesController } from './lego-pieces.controller';

@Module({
  providers: [LegoPiecesService],
  controllers: [LegoPiecesController]
})
export class LegoPiecesModule {}
