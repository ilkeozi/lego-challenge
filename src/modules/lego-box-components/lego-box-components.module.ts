import { Module } from '@nestjs/common';
import { LegoBoxComponentsController } from './lego-box-components.controller';
import { LegoBoxComponentsService } from './lego-box-components.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LegoBoxComponentsController],
  providers: [LegoBoxComponentsService],
  exports: [LegoBoxComponentsService],
})
export class LegoBoxComponentsModule {}
