import { Test, TestingModule } from '@nestjs/testing';
import { LegoBoxPiecesService } from './lego-box-pieces.service';
import { Repository } from 'typeorm';
import { LegoBoxPiece } from 'src/infrastructure/database/entities/lego-box-piece.entity';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLegoBoxPieceDto } from './dtos/create-lego-box-piece.dto';
import { UpdateLegoBoxPieceDto } from './dtos/update-lego-box-piece.dto';
import { EventWaiterService } from 'src/core/services/event-waiter.service';

describe('LegoBoxPiecesService', () => {
  let service: LegoBoxPiecesService;
  let legoBoxPieceRepository: jest.Mocked<Repository<LegoBoxPiece>>;
  let legoBoxRepository: jest.Mocked<Repository<LegoBox>>;
  let eventWaiterService: jest.Mocked<EventWaiterService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegoBoxPiecesService,
        {
          provide: getRepositoryToken(LegoBoxPiece),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            remove: jest.fn(),
            manager: {
              findOne: jest.fn(),
            },
          },
        },
        {
          provide: getRepositoryToken(LegoBox),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: EventWaiterService,
          useValue: {
            emitAndWait: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LegoBoxPiecesService>(LegoBoxPiecesService);
    legoBoxPieceRepository = module.get(
      getRepositoryToken(LegoBoxPiece),
    ) as jest.Mocked<Repository<LegoBoxPiece>>;
    legoBoxRepository = module.get(getRepositoryToken(LegoBox)) as jest.Mocked<
      Repository<LegoBox>
    >;
    eventWaiterService = module.get(
      EventWaiterService,
    ) as jest.Mocked<EventWaiterService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new LegoBoxPiece and wait for a price update', async () => {
      const dto: CreateLegoBoxPieceDto = {
        boxId: 1,
        pieceId: 2,
        amount: 5,
      };

      const mockBox = { id: 1 } as LegoBox;
      const mockPiece = { id: 2, name: 'Brick', price: 10 } as any;

      legoBoxRepository.findOneBy.mockResolvedValue(mockBox);

      // Mock EntityManager.findOne explicitly
      jest
        .spyOn(legoBoxPieceRepository.manager, 'findOne')
        .mockResolvedValue(mockPiece);

      legoBoxPieceRepository.create.mockReturnValue({
        id: 1,
        box: mockBox,
        piece: mockPiece,
        amount: dto.amount,
      } as LegoBoxPiece);
      legoBoxPieceRepository.save.mockResolvedValue({
        id: 1,
        box: mockBox,
        piece: mockPiece,
        amount: dto.amount,
      } as LegoBoxPiece);
      eventWaiterService.emitAndWait.mockResolvedValue(mockBox.id);

      const result = await service.create(dto);

      expect(legoBoxRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(legoBoxPieceRepository.manager.findOne).toHaveBeenCalledWith(
        'LegoPiece',
        { where: { id: 2 } },
      );
      expect(legoBoxPieceRepository.save).toHaveBeenCalled();
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'boxPiece.added',
        expect.objectContaining({
          boxId: 1,
          pieceId: 2,
          amount: 5,
        }),
        'price.updated',
      );
      expect(result).toEqual({
        id: 1,
        boxId: 1,
        pieceId: 2,
        amount: 5,
      });
    });
  });

  describe('update', () => {
    it('should update the amount of an existing LegoBoxPiece and wait for a price update', async () => {
      const dto: UpdateLegoBoxPieceDto = { amount: 10 };
      const mockPiece = {
        id: 1,
        box: { id: 1 },
        piece: { id: 2, name: 'Brick', price: 10 },
        amount: 5,
      } as LegoBoxPiece;

      legoBoxPieceRepository.findOne.mockResolvedValue(mockPiece);
      legoBoxPieceRepository.save.mockResolvedValue({
        ...mockPiece,
        amount: dto.amount,
      });
      eventWaiterService.emitAndWait.mockResolvedValue(mockPiece.box.id);

      const result = await service.update(1, dto);

      expect(legoBoxPieceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['box', 'piece'],
      });
      expect(legoBoxPieceRepository.save).toHaveBeenCalledWith({
        ...mockPiece,
        amount: dto.amount,
      });
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'boxPiece.updated',
        expect.objectContaining({
          boxId: 1,
          pieceId: 2,
          amount: 10,
        }),
        'price.updated',
      );
      expect(result).toEqual({
        id: 1,
        boxId: 1,
        pieceId: 2,
        amount: 10,
      });
    });
  });

  describe('delete', () => {
    it('should delete a LegoBoxPiece and wait for a price update', async () => {
      const mockPiece = {
        id: 1,
        box: { id: 1 },
        piece: { id: 2, name: 'Brick', price: 10 },
        amount: 5,
      } as LegoBoxPiece;

      legoBoxPieceRepository.findOne.mockResolvedValue(mockPiece);

      await service.delete(1);

      expect(legoBoxPieceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['box', 'piece'],
      });
      expect(legoBoxPieceRepository.remove).toHaveBeenCalledWith(mockPiece);
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'boxPiece.deleted',
        expect.objectContaining({
          boxId: 1,
          pieceId: 2,
        }),
        'price.updated',
      );
    });
  });
});
