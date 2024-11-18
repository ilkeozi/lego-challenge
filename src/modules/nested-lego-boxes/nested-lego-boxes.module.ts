import { Module } from '@nestjs/common';
import { NestedLegoBoxesService } from './nested-lego-boxes.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [NestedLegoBoxesService],
  exports: [NestedLegoBoxesService],
})
export class NestedLegoBoxesModule {}
