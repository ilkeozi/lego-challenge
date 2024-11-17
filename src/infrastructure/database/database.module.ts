import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LegoPiece } from './entities/lego-piece.entity';
import { LegoBoxComponent } from './entities/lego-box-component.entity';
import { LegoBox } from './entities/lego-box.entity';
import { LegoBoxComponentRepository } from './repositories/lego-box-component.repository';
import { LegoBoxRepository } from './repositories/lego-box.repository';

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
    TypeOrmModule.forFeature([LegoPiece, LegoBox, LegoBoxComponent]), // Register entities
  ],
  providers: [
    {
      provide: LegoBoxRepository,
      useFactory: (dataSource: DataSource) => new LegoBoxRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: LegoBoxComponentRepository,
      useFactory: (dataSource: DataSource) =>
        new LegoBoxComponentRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [TypeOrmModule, LegoBoxRepository, LegoBoxComponentRepository],
})
export class DatabaseModule {}
