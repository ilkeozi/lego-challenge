import { Test, TestingModule } from '@nestjs/testing';
import { LegoPiecesService } from './lego-pieces.service';

describe('LegoPiecesService', () => {
  let service: LegoPiecesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegoPiecesService],
    }).compile();

    service = module.get<LegoPiecesService>(LegoPiecesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
