import { Test, TestingModule } from '@nestjs/testing';
import { LegoBoxesService } from './lego-boxes.service';
import { LegoBoxRepository } from 'src/infrastructure/database/repositories/lego-box.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateLegoBoxDto } from './dtos/create-lego-box.dto';
import { UpdateLegoBoxDto } from './dtos/update-lego-box.dto';
import { LegoBoxDto } from './dtos/lego-box.dto';

describe('LegoBoxesService', () => {
  let service: LegoBoxesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    getTotalPrice: jest.fn(),
    updateDirectPrice: jest.fn(),
    updateNestedPrice: jest.fn(),
    refreshMaterializedView: jest.fn(),
  };

  const mapToDto = (entity: any): LegoBoxDto => {
    const { lego_box_id, name } = entity;
    return { lego_box_id, name };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegoBoxesService,
        {
          provide: LegoBoxRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LegoBoxesService>(LegoBoxesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a Lego box as a DTO', async () => {
      const createLegoBoxDto: CreateLegoBoxDto = {
        name: 'Classic Bricks Set',
      };
      const mockLegoBox = {
        lego_box_id: 'uuid-1',
        name: createLegoBoxDto.name,
        direct_price: 0, // Default internal value for the repository
      };

      mockRepository.create.mockReturnValue(mockLegoBox);
      mockRepository.save.mockResolvedValue(mockLegoBox);

      const result = await service.create(createLegoBoxDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createLegoBoxDto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockLegoBox);
      expect(result).toEqual(mapToDto(mockLegoBox));
    });
  });

  describe('findAll', () => {
    it('should return an array of Lego boxes as DTOs', async () => {
      const mockLegoBoxes = [
        {
          lego_box_id: 'uuid-1',
          name: 'Set A',
          direct_price: 50,
        },
        {
          lego_box_id: 'uuid-2',
          name: 'Set B',
          direct_price: 75,
        },
      ];

      mockRepository.find.mockResolvedValue(mockLegoBoxes);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockLegoBoxes.map(mapToDto));
    });
  });

  describe('findById', () => {
    it('should return a Lego box as a DTO if found', async () => {
      const mockLegoBox = {
        lego_box_id: 'uuid-1',
        name: 'Set A',
        direct_price: 50,
      };

      mockRepository.findOneBy.mockResolvedValue(mockLegoBox);

      const result = await service.findById('uuid-1');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_box_id: 'uuid-1',
      });
      expect(result).toEqual(mapToDto(mockLegoBox));
    });

    it('should throw NotFoundException if Lego box is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_box_id: 'uuid-1',
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated Lego box as a DTO', async () => {
      const updateLegoBoxDto: UpdateLegoBoxDto = { name: 'Updated Set A' };
      const mockLegoBox = {
        lego_box_id: 'uuid-1',
        name: 'Set A',
      };

      mockRepository.findOneBy.mockResolvedValue(mockLegoBox);
      mockRepository.save.mockResolvedValue({
        ...mockLegoBox,
        ...updateLegoBoxDto,
      });

      const result = await service.update('uuid-1', updateLegoBoxDto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_box_id: 'uuid-1',
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockLegoBox,
        ...updateLegoBoxDto,
      });
      expect(result).toEqual(mapToDto({ ...mockLegoBox, ...updateLegoBoxDto }));
    });

    it('should throw NotFoundException if Lego box to update is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update('uuid-1', { name: 'Updated Set A' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_box_id: 'uuid-1',
      });
    });
  });

  describe('delete', () => {
    it('should delete a Lego box successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete('uuid-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw NotFoundException if Lego box to delete is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete('uuid-1')).rejects.toThrow(NotFoundException);
      expect(mockRepository.delete).toHaveBeenCalledWith('uuid-1');
    });
  });
});
