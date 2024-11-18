import { Test, TestingModule } from '@nestjs/testing';
import { LegoBoxesController } from './lego-boxes.controller';
import { LegoBoxesService } from './lego-boxes.service';
import { CreateLegoBoxDto } from './dtos/create-lego-box.dto';
import { LegoBoxDto } from './dtos/lego-box.dto';
import { LegoBoxPiecesService } from '../lego-box-pieces/lego-box-pieces.service';
import { LegoBoxPieceDto } from '../lego-box-pieces/dtos/lego-box-piece.dto';
import { UpdateLegoBoxPieceDto } from '../lego-box-pieces/dtos/update-lego-box-piece.dto';
import { NestedLegoBoxDto } from '../nested-lego-boxes/dtos/nested-lego-box.dto';
import { UpdateNestedLegoBoxDto } from '../nested-lego-boxes/dtos/update-nested-lego-box.dto';
import { NestedLegoBoxesService } from '../nested-lego-boxes/nested-lego-boxes.service';
import { CreateLegoBoxPieceDto } from '../lego-box-pieces/dtos/create-lego-box-piece.dto';
import { CreateNestedLegoBoxDto } from '../nested-lego-boxes/dtos/create-nested-lego-box.dto';

describe('LegoBoxesController', () => {
  let controller: LegoBoxesController;

  const mockLegoBoxesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLegoBoxPiecesService = {
    findAllByBoxId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockNestedLegoBoxesService = {
    findAllByParentBoxId: jest.fn(),
    findAllByBoxId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegoBoxesController],
      providers: [
        {
          provide: LegoBoxesService,
          useValue: mockLegoBoxesService,
        },
        {
          provide: LegoBoxPiecesService,
          useValue: mockLegoBoxPiecesService,
        },
        {
          provide: NestedLegoBoxesService,
          useValue: mockNestedLegoBoxesService,
        },
      ],
    }).compile();

    controller = module.get<LegoBoxesController>(LegoBoxesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a Lego box', async () => {
      const createLegoBoxDto: CreateLegoBoxDto = { name: 'Classic Bricks Set' };
      const mockLegoBox: LegoBoxDto = {
        id: 1,
        name: 'Classic Bricks Set',
        totalPrice: 0,
      };

      mockLegoBoxesService.create.mockResolvedValue(mockLegoBox);

      const result = await controller.create(createLegoBoxDto);

      expect(mockLegoBoxesService.create).toHaveBeenCalledWith(
        createLegoBoxDto,
      );
      expect(result).toEqual(mockLegoBox);
    });
  });

  describe('findAll', () => {
    it('should return an array of Lego boxes', async () => {
      const mockLegoBoxes: LegoBoxDto[] = [
        { id: 1, name: 'Set A', totalPrice: 100 },
        { id: 2, name: 'Set B', totalPrice: 150 },
      ];

      mockLegoBoxesService.findAll.mockResolvedValue(mockLegoBoxes);

      const result = await controller.findAll();

      expect(mockLegoBoxesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockLegoBoxes);
    });
  });

  describe('findOne', () => {
    it('should return a single Lego box', async () => {
      const mockLegoBox: LegoBoxDto = {
        id: 1,
        name: 'Set A',
        totalPrice: 100,
      };

      mockLegoBoxesService.findById.mockResolvedValue(mockLegoBox);

      const result = await controller.findOne(1);

      expect(mockLegoBoxesService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLegoBox);
    });
  });

  // Tests for LegoBoxPiecesService
  describe('findPieces', () => {
    it('should return all pieces in a Lego box', async () => {
      const boxId = 1;
      const mockPieces: LegoBoxPieceDto[] = [
        { id: 1, boxId: 1, pieceId: 2, amount: 5 },
        { id: 2, boxId: 1, pieceId: 3, amount: 10 },
      ];

      mockLegoBoxPiecesService.findAllByBoxId.mockResolvedValue(mockPieces);

      const result = await controller.findPieces(boxId);

      expect(mockLegoBoxPiecesService.findAllByBoxId).toHaveBeenCalledWith(
        boxId,
      );
      expect(result).toEqual(mockPieces);
    });
  });

  describe('addPiece', () => {
    it('should add a piece to a Lego box', async () => {
      const boxId = 1;
      const createPieceDto: CreateLegoBoxPieceDto = {
        boxId: 1,
        pieceId: 2,
        amount: 5,
      };
      const mockPiece: LegoBoxPieceDto = {
        id: 1,
        boxId: 1,
        pieceId: 2,
        amount: 5,
      };

      mockLegoBoxPiecesService.create.mockResolvedValue(mockPiece);

      const result = await controller.addPiece(boxId, createPieceDto);

      expect(mockLegoBoxPiecesService.create).toHaveBeenCalledWith(
        createPieceDto,
      );
      expect(result).toEqual(mockPiece);
    });
  });

  describe('findNestedBoxes', () => {
    it('should return all nested boxes in a Lego box', async () => {
      const boxId = 1;
      const mockNestedBoxes: NestedLegoBoxDto[] = [
        { id: 1, parentBoxId: 1, childBoxId: 2, amount: 3 },
      ];

      mockNestedLegoBoxesService.findAllByParentBoxId.mockResolvedValue(
        mockNestedBoxes,
      );

      const result = await controller.findNestedBoxes(boxId);

      expect(
        mockNestedLegoBoxesService.findAllByParentBoxId,
      ).toHaveBeenCalledWith(boxId);

      expect(result).toEqual(mockNestedBoxes);
    });
  });

  describe('addNestedBox', () => {
    it('should add a nested box to a Lego box', async () => {
      const boxId = 1;
      const createNestedBoxDto: CreateNestedLegoBoxDto = {
        parentBoxId: 1,
        childBoxId: 2,
        amount: 5,
      };
      const mockNestedBox: NestedLegoBoxDto = {
        id: 1,
        parentBoxId: 1,
        childBoxId: 2,
        amount: 5,
      };

      mockNestedLegoBoxesService.create.mockResolvedValue(mockNestedBox);

      const result = await controller.addNestedBox(boxId, createNestedBoxDto);

      expect(mockNestedLegoBoxesService.create).toHaveBeenCalledWith(
        createNestedBoxDto,
      );
      expect(result).toEqual(mockNestedBox);
    });
  });

  describe('updatePieceAmount', () => {
    it('should update the amount of a piece in a Lego box', async () => {
      const boxId = 1;
      const pieceId = 2;
      const updatePieceDto: UpdateLegoBoxPieceDto = { amount: 10 };
      const mockUpdatedPiece: LegoBoxPieceDto = {
        id: 1,
        boxId: 1,
        pieceId: 2,
        amount: 10,
      };

      mockLegoBoxPiecesService.update.mockResolvedValue(mockUpdatedPiece);

      const result = await controller.updatePieceAmount(
        boxId,
        pieceId,
        updatePieceDto,
      );

      expect(mockLegoBoxPiecesService.update).toHaveBeenCalledWith(
        pieceId,
        updatePieceDto,
      );
      expect(result).toEqual(mockUpdatedPiece);
    });
  });

  describe('removePiece', () => {
    it('should remove a piece from a Lego box', async () => {
      const boxId = 1;
      const pieceId = 2;

      mockLegoBoxPiecesService.delete.mockResolvedValue(undefined);

      await controller.removePiece(boxId, pieceId);

      expect(mockLegoBoxPiecesService.delete).toHaveBeenCalledWith(pieceId);
    });
  });

  describe('updateNestedBox', () => {
    it('should update the amount of a nested Lego box', async () => {
      const parentBoxId = 1;
      const nestedBoxId = 2;
      const updateNestedBoxDto: UpdateNestedLegoBoxDto = { amount: 7 };
      const mockUpdatedNestedBox: NestedLegoBoxDto = {
        id: 2,
        parentBoxId: 1,
        childBoxId: 3,
        amount: 7,
      };

      mockNestedLegoBoxesService.update.mockResolvedValue(mockUpdatedNestedBox);

      const result = await controller.updateNestedBoxAmount(
        parentBoxId,
        nestedBoxId,
        updateNestedBoxDto,
      );

      expect(mockNestedLegoBoxesService.update).toHaveBeenCalledWith(
        nestedBoxId,
        updateNestedBoxDto,
      );
      expect(result).toEqual(mockUpdatedNestedBox);
    });
  });

  describe('removeNestedBox', () => {
    it('should remove a nested Lego box', async () => {
      const parentBoxId = 1;
      const nestedBoxId = 2;

      mockNestedLegoBoxesService.delete.mockResolvedValue(undefined);

      await controller.removeNestedBox(parentBoxId, nestedBoxId);

      expect(mockNestedLegoBoxesService.delete).toHaveBeenCalledWith(
        nestedBoxId,
      );
    });
  });
});
