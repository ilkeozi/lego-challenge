import { Module } from '@nestjs/common';
import { LegoBoxesController } from './lego-boxes.controller';
import { LegoBoxesService } from './lego-boxes.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LegoBoxComponentsModule } from '../lego-box-components/lego-box-components.module';

@Module({
  imports: [DatabaseModule, LegoBoxComponentsModule],
  controllers: [LegoBoxesController],
  providers: [LegoBoxesService],
})
export class LegoBoxesModule {}
