import { Test, TestingModule } from '@nestjs/testing';
import { LegoBoxComponentsController } from './lego-box-components.controller';
import { LegoBoxComponentsService } from './lego-box-components.service';
import { AddComponentsDto } from './dtos/add-component.dto';
import { CreateComponentDto } from './dtos/create-component.dto';
import { UpdateComponentDto } from './dtos/update-component.dto';
import { ComponentDto } from './dtos/component.dto';

describe('LegoBoxComponentsController', () => {
  let controller: LegoBoxComponentsController;
  let service: LegoBoxComponentsService;

  const mockService = {
    addComponents: jest.fn(),
    createComponent: jest.fn(),
    getComponentsByParentId: jest.fn(),
    updateComponent: jest.fn(),
    deleteComponent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegoBoxComponentsController],
      providers: [
        {
          provide: LegoBoxComponentsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LegoBoxComponentsController>(
      LegoBoxComponentsController,
    );
    service = module.get<LegoBoxComponentsService>(LegoBoxComponentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addComponents', () => {
    it('should call the service with the correct data', async () => {
      const addComponentsDto: AddComponentsDto = {
        parent_item_id: 'uuid-1',
        components: [
          { component_type: 'piece', component_id: 'uuid-2', amount: 2 },
        ],
      };

      await controller.addComponents(addComponentsDto);

      expect(service.addComponents).toHaveBeenCalledWith(addComponentsDto);
      expect(service.addComponents).toHaveBeenCalledTimes(1);
    });
  });

  describe('createComponent', () => {
    it('should return the created component', async () => {
      const parentItemId = 'uuid-1';
      const createComponentDto: CreateComponentDto = {
        component_type: 'piece',
        component_id: 'uuid-2',
        amount: 3,
      };

      const mockComponentDto: ComponentDto = {
        component_type: 'piece',
        component_id: 'uuid-2',
        amount: 3,
      };

      mockService.createComponent.mockResolvedValue(mockComponentDto);

      const result = await controller.createComponent(
        parentItemId,
        createComponentDto,
      );

      expect(service.createComponent).toHaveBeenCalledWith(
        parentItemId,
        createComponentDto,
      );
      expect(result).toEqual(mockComponentDto);
    });
  });

  describe('getComponentsByParentId', () => {
    it('should return an array of components', async () => {
      const parentItemId = 'uuid-1';
      const mockComponents: ComponentDto[] = [
        { component_type: 'piece', component_id: 'uuid-2', amount: 2 },
        { component_type: 'set', component_id: 'uuid-3', amount: 1 },
      ];

      mockService.getComponentsByParentId.mockResolvedValue(mockComponents);

      const result = await controller.getComponentsByParentId(parentItemId);

      expect(service.getComponentsByParentId).toHaveBeenCalledWith(
        parentItemId,
      );
      expect(result).toEqual(mockComponents);
    });
  });

  describe('updateComponent', () => {
    it('should return the updated component', async () => {
      const id = 'uuid-1';
      const updateComponentDto: UpdateComponentDto = {
        component_type: 'set',
        component_id: 'uuid-4',
        amount: 5,
      };

      const mockUpdatedComponent: ComponentDto = {
        component_type: 'set',
        component_id: 'uuid-4',
        amount: 5,
      };

      mockService.updateComponent.mockResolvedValue(mockUpdatedComponent);

      const result = await controller.updateComponent(id, updateComponentDto);

      expect(service.updateComponent).toHaveBeenCalledWith(
        id,
        updateComponentDto,
      );
      expect(result).toEqual(mockUpdatedComponent);
    });
  });

  describe('deleteComponent', () => {
    it('should call the service with the correct ID', async () => {
      const id = 'uuid-1';

      await controller.deleteComponent(id);

      expect(service.deleteComponent).toHaveBeenCalledWith(id);
      expect(service.deleteComponent).toHaveBeenCalledTimes(1);
    });
  });
});
