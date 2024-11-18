import { Test, TestingModule } from '@nestjs/testing';
import { NestedLegoBoxesService } from './nested-lego-boxes.service';
import { Repository } from 'typeorm';
import { NestedLegoBox } from 'src/infrastructure/database/entities/nested-lego-box.entity';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventWaiterService } from 'src/core/services/event-waiter.service';
import { CreateNestedLegoBoxDto } from './dtos/create-nested-lego-box.dto';
import { UpdateNestedLegoBoxDto } from './dtos/update-nested-lego-box.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('NestedLegoBoxesService', () => {
  let service: NestedLegoBoxesService;
  let nestedLegoBoxRepository: jest.Mocked<Repository<NestedLegoBox>>;
  let legoBoxRepository: jest.Mocked<Repository<LegoBox>>;
  let eventWaiterService: jest.Mocked<EventWaiterService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NestedLegoBoxesService,
        {
          provide: getRepositoryToken(NestedLegoBox),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LegoBox),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
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

    service = module.get<NestedLegoBoxesService>(NestedLegoBoxesService);
    nestedLegoBoxRepository = module.get(
      getRepositoryToken(NestedLegoBox),
    ) as jest.Mocked<Repository<NestedLegoBox>>;
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
    it('should create a new NestedLegoBox and wait for the box.priceUpdated event', async () => {
      const dto: CreateNestedLegoBoxDto = {
        parentBoxId: 1,
        childBoxId: 2,
        amount: 3,
      };

      const mockParentBox = { id: 1 } as LegoBox;
      const mockChildBox = { id: 2 } as LegoBox;

      legoBoxRepository.findOneBy.mockResolvedValueOnce(mockParentBox);
      legoBoxRepository.findOneBy.mockResolvedValueOnce(mockChildBox);
      nestedLegoBoxRepository.create.mockReturnValue({
        id: 1,
        parentBox: mockParentBox,
        childBox: mockChildBox,
        amount: dto.amount,
      } as NestedLegoBox);
      nestedLegoBoxRepository.save.mockResolvedValue({
        id: 1,
        parentBox: mockParentBox,
        childBox: mockChildBox,
        amount: dto.amount,
      } as NestedLegoBox);
      eventWaiterService.emitAndWait.mockResolvedValue(undefined);

      const result = await service.create(dto);

      expect(legoBoxRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(legoBoxRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(nestedLegoBoxRepository.create).toHaveBeenCalledWith({
        parentBox: mockParentBox,
        childBox: mockChildBox,
        amount: 3,
      });
      expect(nestedLegoBoxRepository.save).toHaveBeenCalled();
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'nestedBox.added',
        expect.objectContaining({
          id: 1,
          parentBoxId: 1,
          childBoxId: 2,
          amount: 3,
        }),
        'box.priceUpdated',
        expect.any(Function),
        1000,
      );
      expect(result).toEqual({
        id: 1,
        parentBoxId: 1,
        childBoxId: 2,
        amount: 3,
      });
    });
  });

  describe('update', () => {
    it('should update the amount of an existing NestedLegoBox and wait for the box.priceUpdated event', async () => {
      const dto: UpdateNestedLegoBoxDto = { amount: 5 };
      const mockNestedBox = {
        id: 1,
        parentBox: { id: 1 },
        childBox: { id: 2 },
        amount: 3,
      } as NestedLegoBox;

      nestedLegoBoxRepository.findOne.mockResolvedValue(mockNestedBox);
      nestedLegoBoxRepository.save.mockResolvedValue({
        ...mockNestedBox,
        amount: dto.amount,
      });
      eventWaiterService.emitAndWait.mockResolvedValue(undefined);

      const result = await service.update(1, dto);

      expect(nestedLegoBoxRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['parentBox', 'childBox'],
      });
      expect(nestedLegoBoxRepository.save).toHaveBeenCalledWith({
        ...mockNestedBox,
        amount: dto.amount,
      });
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'nestedBox.updated',
        expect.objectContaining({
          id: 1,
          parentBoxId: 1,
          childBoxId: 2,
          amount: 5,
        }),
        'box.priceUpdated',
        expect.any(Function),
        1000,
      );
      expect(result).toEqual({
        id: 1,
        parentBoxId: 1,
        childBoxId: 2,
        amount: 5,
      });
    });
  });

  describe('delete', () => {
    it('should delete a NestedLegoBox and wait for the box.priceUpdated event', async () => {
      const mockNestedBox = {
        id: 1,
        parentBox: { id: 1 },
        childBox: { id: 2 },
        amount: 3,
      } as NestedLegoBox;

      nestedLegoBoxRepository.findOne.mockResolvedValue(mockNestedBox);
      eventWaiterService.emitAndWait.mockResolvedValue(undefined);

      await service.delete(1);

      expect(nestedLegoBoxRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['parentBox', 'childBox'],
      });
      expect(nestedLegoBoxRepository.delete).toHaveBeenCalledWith(1);
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'nestedBox.removed',
        expect.objectContaining({
          id: 1,
          parentBoxId: 1,
          childBoxId: 2,
          amount: 3,
        }),
        'box.priceUpdated',
        expect.any(Function),
        1000,
      );
    });
  });
});
