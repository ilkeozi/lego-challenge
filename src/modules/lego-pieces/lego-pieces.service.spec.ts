import { Test, TestingModule } from '@nestjs/testing';
import { LegoPiecesService } from './lego-pieces.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LegoPiece } from 'src/infrastructure/database/entities/lego-piece.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateLegoPieceDto } from './dtos/create-lego-piece.dto';
import { UpdateLegoPieceDto } from './dtos/update-lego-piece.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('LegoPiecesService', () => {
  let service: LegoPiecesService;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegoPiecesService,
        {
          provide: getRepositoryToken(LegoPiece),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<LegoPiecesService>(LegoPiecesService);
    eventEmitter = module.get(EventEmitter2) as jest.Mocked<EventEmitter2>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a Lego piece and emit an event', async () => {
      const createLegoPieceDto: CreateLegoPieceDto = {
        name: 'Rectangle Brick',
        price: 10.5,
      };
      const mockLegoPiece: LegoPiece = {
        id: 1,
        name: 'Rectangle Brick',
        price: 10.5,
      } as LegoPiece;

      mockRepository.create.mockReturnValue(mockLegoPiece);
      mockRepository.save.mockResolvedValue(mockLegoPiece);

      const result = await service.create(createLegoPieceDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createLegoPieceDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockLegoPiece);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'legoPiece.created',
        expect.objectContaining({ pieceId: 1 }),
      );
      expect(result).toEqual({ id: 1, name: 'Rectangle Brick', price: 10.5 });
    });
  });

  describe('findAll', () => {
    it('should return an array of Lego pieces', async () => {
      const mockLegoPieces: LegoPiece[] = [
        { id: 1, name: 'Piece A', price: 5 } as LegoPiece,
        { id: 2, name: 'Piece B', price: 10 } as LegoPiece,
      ];

      mockRepository.find.mockResolvedValue(mockLegoPieces);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Piece A', price: 5 },
        { id: 2, name: 'Piece B', price: 10 },
      ]);
    });
  });

  describe('findById', () => {
    it('should return a Lego piece if found', async () => {
      const mockLegoPiece: LegoPiece = {
        id: 1,
        name: 'Rectangle Brick',
        price: 10.5,
      } as LegoPiece;

      mockRepository.findOneBy.mockResolvedValue(mockLegoPiece);

      const result = await service.findById(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ id: 1, name: 'Rectangle Brick', price: 10.5 });
    });

    it('should throw NotFoundException if Lego piece is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update and return the updated Lego piece and emit an event', async () => {
      const updateLegoPieceDto: UpdateLegoPieceDto = {
        name: 'Updated Rectangle Brick',
      };
      const mockLegoPiece: LegoPiece = {
        id: 1,
        name: 'Rectangle Brick',
        price: 10.5,
      } as LegoPiece;

      mockRepository.findOneBy.mockResolvedValue(mockLegoPiece);
      mockRepository.save.mockResolvedValue({
        ...mockLegoPiece,
        ...updateLegoPieceDto,
      });

      const result = await service.update(1, updateLegoPieceDto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockLegoPiece,
        ...updateLegoPieceDto,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'legoPiece.updated',
        expect.objectContaining({ pieceId: 1 }),
      );
      expect(result).toEqual({
        id: 1,
        name: 'Updated Rectangle Brick',
        price: 10.5,
      });
    });

    it('should throw NotFoundException if Lego piece to update is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(1, { name: 'Updated Rectangle Brick' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a Lego piece and emit an event', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'legoPiece.deleted',
        expect.objectContaining({ pieceId: 1 }),
      );
    });

    it('should throw NotFoundException if Lego piece to delete is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
