import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { LegoBox } from '../src/infrastructure/database/entities/lego-box.entity';
import { LegoPiece } from '../src/infrastructure/database/entities/lego-piece.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Price Update Propagation (e2e)', () => {
  let app: INestApplication;
  let legoBoxRepository: Repository<LegoBox>;
  let legoPieceRepository: Repository<LegoPiece>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    legoBoxRepository = moduleFixture.get<Repository<LegoBox>>(
      getRepositoryToken(LegoBox),
    );

    legoPieceRepository = moduleFixture.get<Repository<LegoPiece>>(
      getRepositoryToken(LegoPiece),
    );

    await app.init();
    const predefinedPieces = [
      { name: 'Square Brick', price: 0.1 },
      { name: 'Rectangle Brick', price: 0.08 },
      { name: 'Circle Brick', price: 0.07 },
      { name: 'Triangle Brick', price: 0.06 },
      { name: 'Hexagon Brick', price: 0.09 },
    ];

    for (const piece of predefinedPieces) {
      const existingPiece = await legoPieceRepository.findOne({
        where: { name: piece.name },
      });

      if (!existingPiece) {
        await legoPieceRepository.save(piece);
      }
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should propagate price updates from a nested set to parent sets', async () => {
    const piece1 = await legoPieceRepository.findOne({
      where: { name: 'Rectangle Brick' },
    });
    const piece2 = await legoPieceRepository.findOne({
      where: { name: 'Hexagon Brick' },
    });

    const classicSetResponse = await request(app.getHttpServer())
      .post('/lego-challenge/create-box')
      .send({ name: 'Classic Bricks Set' })
      .expect(201);

    const classicSet = await legoBoxRepository.findOne({
      where: { name: 'Classic Bricks Set' },
    });

    const addComponentsDto = {
      parent_item_id: classicSet?.id,
      components: [
        { component_type: 'piece', component_id: piece1?.id, amount: 2 },
        { component_type: 'piece', component_id: piece2?.id, amount: 2 },
      ],
    };

    await request(app.getHttpServer())
      .post('/lego-challenge/add-components')
      .send(addComponentsDto)
      .expect(201);

    const updatedClassicSet = await legoBoxRepository.findOne({
      where: { id: classicSet?.id },
    });
    expect(updatedClassicSet?.totalPrice).toBeCloseTo(0.34, 2);
  });
});
