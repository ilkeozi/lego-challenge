import { Test, TestingModule } from '@nestjs/testing';
import { LegoPiecesController } from './lego-pieces.controller';

describe('LegoPiecesController', () => {
  let controller: LegoPiecesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegoPiecesController],
    }).compile();

    controller = module.get<LegoPiecesController>(LegoPiecesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
