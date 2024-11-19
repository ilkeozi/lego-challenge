import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingListener } from './listeners/pricing.listener';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LegoBoxesModule } from '../lego-boxes/lego-boxes.module';
import { LegoBoxesService } from '../lego-boxes/lego-boxes.service';

@Module({
  imports: [DatabaseModule, LegoBoxesModule],
  providers: [PricingService, PricingListener, LegoBoxesService],
  exports: [PricingService],
})
export class PricingModule {}
