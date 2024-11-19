import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { LegoBox } from '../src/infrastructure/database/entities/lego-box.entity';
import { LegoBoxPiece } from '../src/infrastructure/database/entities/lego-box-piece.entity';
import { NestedLegoBox } from '../src/infrastructure/database/entities/nested-lego-box.entity';
import { LegoPiece } from '../src/infrastructure/database/entities/lego-piece.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LegoChallengeController (e2e)', () => {
  let app: INestApplication;
  let legoBoxRepository: Repository<LegoBox>;
  let legoBoxPieceRepository: Repository<LegoBoxPiece>;
  let nestedLegoBoxRepository: Repository<NestedLegoBox>;
  let legoPieceRepository: Repository<LegoPiece>;
  let createdBoxIds: number[] = [];
  let createdNestedBoxIds: number[] = [];

  const predefinedPieces = [
    { name: 'Square Brick', price: 0.1 },
    { name: 'Rectangle Brick', price: 0.08 },
    { name: 'Circle Brick', price: 0.07 },
    { name: 'Triangle Brick', price: 0.06 },
    { name: 'Hexagon Brick', price: 0.09 },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same global pipes as in your main.ts
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
    legoBoxPieceRepository = moduleFixture.get<Repository<LegoBoxPiece>>(
      getRepositoryToken(LegoBoxPiece),
    );
    nestedLegoBoxRepository = moduleFixture.get<Repository<NestedLegoBox>>(
      getRepositoryToken(NestedLegoBox),
    );
    legoPieceRepository = moduleFixture.get<Repository<LegoPiece>>(
      getRepositoryToken(LegoPiece),
    );

    await app.init();

    // Ensure predefined pieces exist
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

  afterEach(async () => {
    // Clean up created nested boxes
    for (const nestedBoxId of createdNestedBoxIds) {
      await nestedLegoBoxRepository.delete(nestedBoxId);
    }
    createdNestedBoxIds = [];

    // Clean up created boxes
    for (const boxId of createdBoxIds) {
      await legoBoxRepository.delete(boxId);
    }
    createdBoxIds = [];
  });

  it('should create a Lego Box successfully', async () => {
    const createLegoBoxDto = {
      name: 'Classic Bricks Set',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/lego-challenge/create-box')
      .send(createLegoBoxDto)
      .expect(201);

    expect(createResponse.body).toEqual({});

    const createdBox = await legoBoxRepository.findOne({
      where: { name: createLegoBoxDto.name },
    });

    expect(createdBox).toBeDefined();
    expect(createdBox?.name).toBe(createLegoBoxDto.name);
    expect(createdBox?.id).toBeGreaterThan(0);

    createdBoxIds.push(createdBox?.id);
  });

  it('should fail when creating a Lego Box with invalid data', async () => {
    const invalidDto = {};

    const response = await request(app.getHttpServer())
      .post('/lego-challenge/create-box')
      .send(invalidDto)
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        message: expect.arrayContaining([
          'name should not be empty',
          'name must be a string',
        ]),
        error: 'Bad Request',
      }),
    );
  });

  it('should verify components added to a Lego Box', async () => {
    const createLegoBoxDto = {
      name: 'Test Lego Box with Components',
    };

    // Create the parent Lego Box
    const createBoxResponse = await request(app.getHttpServer())
      .post('/lego-challenge/create-box')
      .send(createLegoBoxDto)
      .expect(201);

    // Validate the response for creating the Lego Box
    expect(createBoxResponse.body).toEqual({}); // Assuming void method returns an empty body

    // Retrieve the created Lego Box
    const parentBox = await legoBoxRepository.findOne({
      where: { name: createLegoBoxDto.name },
    });

    expect(parentBox).toBeDefined();
    expect(parentBox?.name).toBe(createLegoBoxDto.name);

    const addComponentsDto = {
      parent_item_id: parentBox?.id,
      components: [
        {
          component_type: 'piece',
          component_id: 1, // Assuming valid piece ID
          amount: 2,
        },
        {
          component_type: 'piece',
          component_id: 2, // Assuming valid piece ID
          amount: 3,
        },
      ],
    };

    // Add components to the Lego Box
    const addComponentsResponse = await request(app.getHttpServer())
      .post('/lego-challenge/add-components')
      .send(addComponentsDto)
      .expect(201);

    // Validate the response for adding components
    expect(addComponentsResponse.body).toEqual({}); // Assuming void method returns an empty body

    // Verify components were added correctly
    const addedPieces = await legoBoxPieceRepository.find({
      where: { box: { id: parentBox?.id } }, // Adjust query to match relation
      relations: ['piece'], // Load relations if necessary
    });

    expect(addedPieces).toHaveLength(addComponentsDto.components.length);

    addComponentsDto.components.forEach((component) => {
      const piece = addedPieces.find(
        (p) =>
          p.piece.id === component.component_id &&
          p.amount === component.amount,
      );
      expect(piece).toBeDefined();
    });

    // Clean up created box
    await legoBoxRepository.delete(parentBox?.id);
  });
});
