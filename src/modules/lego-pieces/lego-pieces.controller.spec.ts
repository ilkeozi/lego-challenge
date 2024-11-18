import { Test, TestingModule } from '@nestjs/testing';
import { LegoPiecesController } from './lego-pieces.controller';
import { LegoPiecesService } from './lego-pieces.service';
import { CreateLegoPieceDto } from './dtos/create-lego-piece.dto';
import { LegoPieceDto } from './dtos/lego-piece.dto';
import { UpdateLegoPieceDto } from './dtos/update-lego-piece.dto';

describe('LegoPiecesController', () => {
  let controller: LegoPiecesController;

  const mockLegoPiecesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegoPiecesController],
      providers: [
        {
          provide: LegoPiecesService,
          useValue: mockLegoPiecesService,
        },
      ],
    }).compile();

    controller = module.get<LegoPiecesController>(LegoPiecesController);
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
      const mockLegoPiece: LegoPieceDto = {
        id: 1,
        name: 'Rectangle Brick',
        price: 10.5,
      };

      mockLegoPiecesService.create.mockResolvedValue(mockLegoPiece);

      const result = await controller.create(createLegoPieceDto);

      expect(mockLegoPiecesService.create).toHaveBeenCalledWith(
        createLegoPieceDto,
      );
      expect(result).toEqual(mockLegoPiece);
    });
  });

  describe('findAll', () => {
    it('should return an array of Lego pieces', async () => {
      const mockLegoPieces: LegoPieceDto[] = [
        { id: 1, name: 'Piece A', price: 5 },
        { id: 2, name: 'Piece B', price: 10 },
      ];

      mockLegoPiecesService.findAll.mockResolvedValue(mockLegoPieces);

      const result = await controller.findAll();

      expect(mockLegoPiecesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockLegoPieces);
    });
  });

  describe('findOne', () => {
    it('should return a single Lego piece', async () => {
      const mockLegoPiece: LegoPieceDto = {
        id: 1,
        name: 'Rectangle Brick',
        price: 10.5,
      };

      mockLegoPiecesService.findById.mockResolvedValue(mockLegoPiece);

      const result = await controller.findOne(1);

      expect(mockLegoPiecesService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLegoPiece);
    });
  });

  describe('update', () => {
    it('should update and return the updated Lego piece', async () => {
      const updateLegoPieceDto: UpdateLegoPieceDto = {
        name: 'Updated Rectangle Brick',
      };
      const mockUpdatedLegoPiece: LegoPieceDto = {
        id: 1,
        name: 'Updated Rectangle Brick',
        price: 10.5,
      };

      mockLegoPiecesService.update.mockResolvedValue(mockUpdatedLegoPiece);

      const result = await controller.update(1, updateLegoPieceDto);

      expect(mockLegoPiecesService.update).toHaveBeenCalledWith(
        1,
        updateLegoPieceDto,
      );
      expect(result).toEqual(mockUpdatedLegoPiece);
    });
  });

  describe('delete', () => {
    it('should delete a Lego piece', async () => {
      mockLegoPiecesService.delete.mockResolvedValue(undefined);

      await controller.delete(1);

      expect(mockLegoPiecesService.delete).toHaveBeenCalledWith(1);
    });
  });
});
