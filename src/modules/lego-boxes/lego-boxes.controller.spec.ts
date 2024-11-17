import { Test, TestingModule } from '@nestjs/testing';
import { LegoBoxesController } from './lego-boxes.controller';
import { LegoBoxesService } from './lego-boxes.service';
import { LegoBoxComponentsService } from '../lego-box-components/lego-box-components.service';
import { CreateLegoBoxDto } from './dtos/create-lego-box.dto';
import { LegoBoxDto } from './dtos/lego-box.dto';
import { UpdateLegoBoxDto } from './dtos/update-lego-box.dto';
import { ComponentDto } from '../lego-box-components/dtos/component.dto';
import { CreateComponentDto } from '../lego-box-components/dtos/create-component.dto';
import { UpdateComponentDto } from '../lego-box-components/dtos/update-component.dto';

describe('LegoBoxesController', () => {
  let controller: LegoBoxesController;

  const mockLegoBoxesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLegoBoxComponentsService = {
    getComponentsByParentId: jest.fn(),
    createComponent: jest.fn(),
    updateComponent: jest.fn(),
    deleteComponent: jest.fn(),
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
          provide: LegoBoxComponentsService,
          useValue: mockLegoBoxComponentsService,
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
        lego_box_id: 'uuid-1',
        name: 'Classic Bricks Set',
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
        { lego_box_id: 'uuid-1', name: 'Set A' },
        { lego_box_id: 'uuid-2', name: 'Set B' },
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
        lego_box_id: 'uuid-1',
        name: 'Set A',
      };

      mockLegoBoxesService.findById.mockResolvedValue(mockLegoBox);

      const result = await controller.findOne('uuid-1');

      expect(mockLegoBoxesService.findById).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockLegoBox);
    });
  });

  describe('update', () => {
    it('should update and return the updated Lego box', async () => {
      const updateLegoBoxDto: UpdateLegoBoxDto = { name: 'Updated Set A' };
      const mockUpdatedLegoBox: LegoBoxDto = {
        lego_box_id: 'uuid-1',
        name: 'Updated Set A',
      };

      mockLegoBoxesService.update.mockResolvedValue(mockUpdatedLegoBox);

      const result = await controller.update('uuid-1', updateLegoBoxDto);

      expect(mockLegoBoxesService.update).toHaveBeenCalledWith(
        'uuid-1',
        updateLegoBoxDto,
      );
      expect(result).toEqual(mockUpdatedLegoBox);
    });
  });

  describe('delete', () => {
    it('should delete a Lego box', async () => {
      mockLegoBoxesService.delete.mockResolvedValue(undefined);

      await controller.delete('uuid-1');

      expect(mockLegoBoxesService.delete).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('getComponentsByParentId', () => {
    it('should return components for a specific Lego box', async () => {
      const mockComponents: ComponentDto[] = [
        { component_id: 'uuid-1', component_type: 'piece', amount: 2 },
        { component_id: 'uuid-2', component_type: 'set', amount: 1 },
      ];

      mockLegoBoxComponentsService.getComponentsByParentId.mockResolvedValue(
        mockComponents,
      );

      const result = await controller.getComponentsByParentId('uuid-1');

      expect(
        mockLegoBoxComponentsService.getComponentsByParentId,
      ).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockComponents);
    });
  });

  describe('createComponent', () => {
    it('should add a component to a Lego box', async () => {
      const createComponentDto: CreateComponentDto = {
        component_id: 'uuid-1',
        component_type: 'piece',
        amount: 2,
      };

      const mockComponent: ComponentDto = {
        component_id: 'uuid-1',
        component_type: 'piece',
        amount: 2,
      };

      mockLegoBoxComponentsService.createComponent.mockResolvedValue(
        mockComponent,
      );

      const result = await controller.createComponent(
        'uuid-1',
        createComponentDto,
      );

      expect(mockLegoBoxComponentsService.createComponent).toHaveBeenCalledWith(
        'uuid-1',
        createComponentDto,
      );
      expect(result).toEqual(mockComponent);
    });
  });

  describe('updateComponent', () => {
    it('should update a component in a Lego box', async () => {
      const updateComponentDto: UpdateComponentDto = {
        component_id: 'uuid-1',
        component_type: 'piece',
        amount: 3,
      };

      const mockUpdatedComponent: ComponentDto = {
        component_id: 'uuid-1',
        component_type: 'piece',
        amount: 3,
      };

      mockLegoBoxComponentsService.updateComponent.mockResolvedValue(
        mockUpdatedComponent,
      );

      const result = await controller.updateComponent(
        'uuid-1',
        'uuid-2',
        updateComponentDto,
      );

      expect(mockLegoBoxComponentsService.updateComponent).toHaveBeenCalledWith(
        'uuid-2',
        updateComponentDto,
      );
      expect(result).toEqual(mockUpdatedComponent);
    });
  });

  describe('deleteComponent', () => {
    it('should delete a component from a Lego box', async () => {
      mockLegoBoxComponentsService.deleteComponent.mockResolvedValue(undefined);

      await controller.deleteComponent('uuid-1', 'uuid-2');

      expect(mockLegoBoxComponentsService.deleteComponent).toHaveBeenCalledWith(
        'uuid-2',
      );
    });
  });
});
