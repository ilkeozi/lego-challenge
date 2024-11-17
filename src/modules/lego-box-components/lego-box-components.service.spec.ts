import { Test, TestingModule } from '@nestjs/testing';
import { LegoBoxComponentsService } from './lego-box-components.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LegoBoxComponent } from 'src/infrastructure/database/entities/lego-box-component.entity';
import { NotFoundException } from '@nestjs/common';
import { AddComponentsDto } from './dtos/add-component.dto';
import { CreateComponentDto } from './dtos/create-component.dto';
import { UpdateComponentDto } from './dtos/update-component.dto';

describe('LegoBoxComponentsService', () => {
  let service: LegoBoxComponentsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegoBoxComponentsService,
        {
          provide: getRepositoryToken(LegoBoxComponent),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LegoBoxComponentsService>(LegoBoxComponentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addComponents', () => {
    it('should add multiple components to a Lego box', async () => {
      const addComponentsDto: AddComponentsDto = {
        parent_item_id: 'uuid-1',
        components: [
          { component_type: 'piece', component_id: 'uuid-2', amount: 2 },
          { component_type: 'set', component_id: 'uuid-3', amount: 1 },
        ],
      };

      const mockComponents = [
        {
          lego_box_id: 'uuid-1',
          linked_component_id: 'uuid-2',
          component_type: 0,
          quantity: 2,
        },
        {
          lego_box_id: 'uuid-1',
          linked_component_id: 'uuid-3',
          component_type: 1,
          quantity: 1,
        },
      ];

      mockRepository.create.mockImplementation((data) => data);
      mockRepository.save.mockResolvedValue(mockComponents);

      await service.addComponents(addComponentsDto);

      expect(mockRepository.create).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledWith(mockComponents);
    });
  });

  describe('createComponent', () => {
    it('should add a single component to a Lego box', async () => {
      const parentItemId = 'uuid-1';
      const createComponentDto: CreateComponentDto = {
        component_type: 'piece',
        component_id: 'uuid-2',
        amount: 3,
      };

      const mockComponentEntity = {
        lego_box_id: 'uuid-1',
        linked_component_id: 'uuid-2',
        component_type: 0,
        quantity: 3,
      };

      const mockSavedComponent = { ...mockComponentEntity };

      mockRepository.create.mockReturnValue(mockComponentEntity);
      mockRepository.save.mockResolvedValue(mockSavedComponent);

      const result = await service.createComponent(
        parentItemId,
        createComponentDto,
      );

      expect(mockRepository.create).toHaveBeenCalledWith(mockComponentEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(mockComponentEntity);
      expect(result).toEqual({
        component_id: 'uuid-2',
        component_type: 'piece',
        amount: 3,
      });
    });
  });

  describe('updateComponent', () => {
    it('should update a component', async () => {
      const id = 'uuid-1';
      const updateComponentDto: UpdateComponentDto = {
        component_type: 'set',
        component_id: 'uuid-4',
        amount: 5,
      };

      const mockComponent = {
        lego_box_component_id: id,
        lego_box_id: 'uuid-1',
        linked_component_id: 'uuid-2',
        component_type: 0,
        quantity: 2,
      };

      const updatedComponent = {
        ...mockComponent,
        linked_component_id: 'uuid-4',
        component_type: 1,
        quantity: 5,
      };

      mockRepository.findOneBy.mockResolvedValue(mockComponent);
      mockRepository.save.mockResolvedValue(updatedComponent);

      const result = await service.updateComponent(id, updateComponentDto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        lego_box_component_id: id,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedComponent);
      expect(result).toEqual({
        component_id: 'uuid-4',
        component_type: 'set',
        amount: 5,
      });
    });

    it('should throw NotFoundException if the component does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateComponent('uuid-1', {
          component_id: 'uuid-4',
          amount: 5,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteComponent', () => {
    it('should delete a component', async () => {
      const id = 'uuid-1';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteComponent(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if the component does not exist', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteComponent('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getComponentsByParentId', () => {
    it('should return components for a specific Lego box', async () => {
      const parentItemId = 'uuid-1';
      const mockComponents = [
        {
          lego_box_id: 'uuid-1',
          linked_component_id: 'uuid-2',
          component_type: 0,
          quantity: 2,
        },
        {
          lego_box_id: 'uuid-1',
          linked_component_id: 'uuid-3',
          component_type: 1,
          quantity: 1,
        },
      ];

      mockRepository.find.mockResolvedValue(mockComponents);

      const result = await service.getComponentsByParentId(parentItemId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { lego_box_id: parentItemId },
      });
      expect(result).toEqual([
        { component_id: 'uuid-2', component_type: 'piece', amount: 2 },
        { component_id: 'uuid-3', component_type: 'set', amount: 1 },
      ]);
    });
  });
});
