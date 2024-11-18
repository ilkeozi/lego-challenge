import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegoPiece } from './entities/lego-piece.entity';
import { LegoBox } from './entities/lego-box.entity';
import { NestedLegoBox } from './entities/nested-lego-box.entity';
import { LegoBoxPiece } from './entities/lego-box-piece.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'lego_user',
      password: process.env.DATABASE_PASSWORD || 'lego_password',
      database: process.env.DATABASE_NAME || 'lego_database',
      autoLoadEntities: true, // Automatically loads entities
      synchronize: true, // Automatically syncs schema (avoid in production)
      migrations: [__dirname + '/migrations/*.ts'], // Migrations directory
      migrationsRun: true, // Automatically runs migrations
    }),
    TypeOrmModule.forFeature([LegoPiece, LegoBox, NestedLegoBox, LegoBoxPiece]), // Register entities
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
