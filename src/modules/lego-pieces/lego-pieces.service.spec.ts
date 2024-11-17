import { Test, TestingModule } from '@nestjs/testing';
import { LegoPiecesService } from './lego-pieces.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LegoPiece } from 'src/infrastructure/database/entities/lego-piece.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateLegoPieceDto } from './dtos/create-lego-piece.dto';
import { UpdateLegoPieceDto } from './dtos/update-lego-piece.dto';

describe('LegoPiecesService', () => {
  let service: LegoPiecesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegoPiecesService,
        {
          provide: getRepositoryToken(LegoPiece),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LegoPiecesService>(LegoPiecesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a Lego piece', async () => {
      const createLegoPieceDto: CreateLegoPieceDto = {
        name: 'Rectangle Brick',
        price: 10.5,
      };
      const mockLegoPiece: LegoPiece = {
        lego_piece_id: 'uuid-1',
        name: 'Rectangle Brick',
        price: 10.5,
      } as LegoPiece;

      mockRepository.create.mockReturnValue(mockLegoPiece);
      mockRepository.save.mockResolvedValue(mockLegoPiece);

      const result = await service.create(createLegoPieceDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createLegoPieceDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockLegoPiece);
      expect(result).toEqual(mockLegoPiece);
    });
  });

  describe('findAll', () => {
    it('should return an array of Lego pieces', async () => {
      const mockLegoPieces: LegoPiece[] = [
        { lego_piece_id: 'uuid-1', name: 'Piece A', price: 5 } as LegoPiece,
        { lego_piece_id: 'uuid-2', name: 'Piece B', price: 10 } as LegoPiece,
      ];

      mockRepository.find.mockResolvedValue(mockLegoPieces);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockLegoPieces);
    });
  });

  describe('findById', () => {
    it('should return a Lego piece if found', async () => {
      const mockLegoPiece: LegoPiece = {
        lego_piece_id: 'uuid-1',
        name: 'Rectangle Brick',
        price: 10.5,
      } as LegoPiece;

      mockRepository.findOneBy.mockResolvedValue(mockLegoPiece);

      const result = await service.findById('uuid-1');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_piece_id: 'uuid-1',
      });
      expect(result).toEqual(mockLegoPiece);
    });

    it('should throw NotFoundException if Lego piece is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_piece_id: 'uuid-1',
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated Lego piece', async () => {
      const updateLegoPieceDto: UpdateLegoPieceDto = {
        name: 'Updated Rectangle Brick',
      };
      const mockLegoPiece: LegoPiece = {
        lego_piece_id: 'uuid-1',
        name: 'Rectangle Brick',
        price: 10.5,
      } as LegoPiece;

      mockRepository.findOneBy.mockResolvedValue(mockLegoPiece);
      mockRepository.save.mockResolvedValue({
        ...mockLegoPiece,
        ...updateLegoPieceDto,
      });

      const result = await service.update('uuid-1', updateLegoPieceDto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_piece_id: 'uuid-1',
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockLegoPiece,
        ...updateLegoPieceDto,
      });
      expect(result).toEqual({ ...mockLegoPiece, ...updateLegoPieceDto });
    });

    it('should throw NotFoundException if Lego piece to update is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update('uuid-1', { name: 'Updated Rectangle Brick' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_piece_id: 'uuid-1',
      });
    });
  });

  describe('delete', () => {
    it('should delete a Lego piece successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete('uuid-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw NotFoundException if Lego piece to delete is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete('uuid-1')).rejects.toThrow(NotFoundException);
      expect(mockRepository.delete).toHaveBeenCalledWith('uuid-1');
    });
  });
});
