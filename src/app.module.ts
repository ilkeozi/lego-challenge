import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LegoPiecesModule } from './lego-pieces/lego-pieces.module';

@Module({
  imports: [LegoPiecesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
