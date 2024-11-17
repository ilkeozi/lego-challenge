import { Module } from '@nestjs/common';
import { LegoPiecesController } from './lego-pieces.controller';
import { LegoPiecesService } from './lego-pieces.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LegoPiecesController],
  providers: [LegoPiecesService],
})
export class LegoPiecesModule {}
