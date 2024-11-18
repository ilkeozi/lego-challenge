import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { LegoBoxPiece } from 'src/infrastructure/database/entities/lego-box-piece.entity';
import { NestedLegoBox } from 'src/infrastructure/database/entities/nested-lego-box.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';

describe('PricingService', () => {
  let service: PricingService;
  let legoBoxPieceRepository: jest.Mocked<Repository<LegoBoxPiece>>;
  let nestedLegoBoxRepository: jest.Mocked<Repository<NestedLegoBox>>;
  let legoBoxRepository: jest.Mocked<Repository<LegoBox>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: getRepositoryToken(LegoBoxPiece),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(NestedLegoBox),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LegoBox),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    legoBoxPieceRepository = module.get(getRepositoryToken(LegoBoxPiece));
    nestedLegoBoxRepository = module.get(getRepositoryToken(NestedLegoBox));
    legoBoxRepository = module.get(getRepositoryToken(LegoBox));
  });

  describe('calculateTotalPrice', () => {
    it('should calculate the total price of a LegoBox with pieces and nested boxes', async () => {
      const boxId = 1;
      const mockPieces = [
        { amount: 2, piece: { price: 5 } },
        { amount: 1, piece: { price: 10 } },
      ] as LegoBoxPiece[];
      const mockNestedBoxes = [
        { amount: 2, childBox: { id: 2 } },
        { amount: 1, childBox: { id: 3 } },
      ] as NestedLegoBox[];

      legoBoxPieceRepository.find.mockResolvedValue(mockPieces);
      nestedLegoBoxRepository.find.mockResolvedValue(mockNestedBoxes);
      legoBoxRepository.findOneBy.mockResolvedValueOnce({
        id: 2,
        totalPrice: 10,
      } as LegoBox);
      legoBoxRepository.findOneBy.mockResolvedValueOnce({
        id: 3,
        totalPrice: 20,
      } as LegoBox);

      const result = await service.calculateTotalPrice(boxId);

      expect(result).toEqual({
        totalPrice: 60, // Pieces: 20 + Nested Boxes: 40 = 60
        piecesTotal: 20, // (2 * 5) + (1 * 10)
        nestedBoxesTotal: 40, // (2 * 10) + (1 * 20)
      });

      expect(legoBoxPieceRepository.find).toHaveBeenCalledWith({
        where: { box: { id: boxId } },
        relations: ['piece'],
      });
      expect(nestedLegoBoxRepository.find).toHaveBeenCalledWith({
        where: { parentBox: { id: boxId } },
        relations: ['childBox'],
      });
      expect(legoBoxRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(legoBoxRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(legoBoxRepository.findOneBy).toHaveBeenCalledWith({ id: 3 });
    });

    it('should calculate the total price when there are no pieces or nested boxes', async () => {
      const boxId = 1;
      const mockPieces: LegoBoxPiece[] = [];
      const mockNestedBoxes: NestedLegoBox[] = [];

      legoBoxPieceRepository.find.mockResolvedValue(mockPieces);
      nestedLegoBoxRepository.find.mockResolvedValue(mockNestedBoxes);

      const result = await service.calculateTotalPrice(boxId);

      expect(result).toEqual({
        totalPrice: 0,
        piecesTotal: 0,
        nestedBoxesTotal: 0,
      });

      expect(legoBoxPieceRepository.find).toHaveBeenCalledWith({
        where: { box: { id: boxId } },
        relations: ['piece'],
      });
      expect(nestedLegoBoxRepository.find).toHaveBeenCalledWith({
        where: { parentBox: { id: boxId } },
        relations: ['childBox'],
      });
    });

    it('should handle missing nested LegoBoxes and use default totalPrice of 0', async () => {
      const boxId = 1;
      const mockPieces = [{ amount: 3, piece: { price: 7 } }] as LegoBoxPiece[];
      const mockNestedBoxes = [
        { amount: 2, childBox: { id: 2 } },
        { amount: 1, childBox: { id: 3 } },
      ] as NestedLegoBox[];

      legoBoxPieceRepository.find.mockResolvedValue(mockPieces);
      nestedLegoBoxRepository.find.mockResolvedValue(mockNestedBoxes);
      legoBoxRepository.findOneBy.mockResolvedValueOnce(null); // Missing child box
      legoBoxRepository.findOneBy.mockResolvedValueOnce({
        id: 3,
        totalPrice: 15,
      } as LegoBox);

      const result = await service.calculateTotalPrice(boxId);

      expect(result).toEqual({
        totalPrice: 36, // Pieces: 21 + Nested Boxes: 15 = 36
        piecesTotal: 21, // (3 * 7)
        nestedBoxesTotal: 15, // (2 * 0) + (1 * 15)
      });

      expect(legoBoxPieceRepository.find).toHaveBeenCalledWith({
        where: { box: { id: boxId } },
        relations: ['piece'],
      });
      expect(nestedLegoBoxRepository.find).toHaveBeenCalledWith({
        where: { parentBox: { id: boxId } },
        relations: ['childBox'],
      });
      expect(legoBoxRepository.findOneBy).toHaveBeenCalledTimes(2);
    });
  });
});
