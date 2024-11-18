import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingListener } from './listeners/pricing.listener';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LegoBoxesModule } from '../lego-boxes/lego-boxes.module';

@Module({
  imports: [DatabaseModule, LegoBoxesModule],
  providers: [PricingService, PricingListener],
  exports: [PricingService],
})
export class PricingModule {}
