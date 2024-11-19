import { Test, TestingModule } from '@nestjs/testing';
import { LegoBoxesService } from './lego-boxes.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateLegoBoxDto } from './dtos/create-lego-box.dto';
import { UpdateLegoBoxDto } from './dtos/update-lego-box.dto';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventWaiterService } from 'src/core/services/event-waiter.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('LegoBoxesService', () => {
  let service: LegoBoxesService;
  let legoBoxRepository: jest.Mocked<Repository<LegoBox>>;
  let eventWaiterService: jest.Mocked<EventWaiterService>;

  const mockLegoBoxRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockEventWaiterService = {
    emitAndWait: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegoBoxesService,
        {
          provide: getRepositoryToken(LegoBox),
          useValue: mockLegoBoxRepository,
        },
        {
          provide: EventWaiterService,
          useValue: mockEventWaiterService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<LegoBoxesService>(LegoBoxesService);
    legoBoxRepository = module.get(getRepositoryToken(LegoBox));
    eventWaiterService = module.get(EventWaiterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a Lego box and wait for the box.priceUpdated event', async () => {
      const createLegoBoxDto: CreateLegoBoxDto = { name: 'Classic Set' };
      const mockLegoBox: LegoBox = {
        id: 1,
        name: 'Classic Set',
        totalPrice: 0,
        pieces: [],
        childBoxes: [],
      };

      legoBoxRepository.create.mockReturnValue(mockLegoBox);
      legoBoxRepository.save.mockResolvedValue(mockLegoBox);
      eventWaiterService.emitAndWait.mockResolvedValue(1); // Simulate event response

      const result = await service.create(createLegoBoxDto);

      expect(legoBoxRepository.create).toHaveBeenCalledWith(createLegoBoxDto);
      expect(legoBoxRepository.save).toHaveBeenCalledWith(mockLegoBox);
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'box.created',
        expect.objectContaining({ id: 1, name: 'Classic Set' }),
        'price.updated',
      );
      expect(result).toEqual({ id: 1, name: 'Classic Set', totalPrice: 0 });
    });
  });

  describe('update', () => {
    it('should update a Lego box and wait for the box.priceUpdated event', async () => {
      const updateLegoBoxDto: UpdateLegoBoxDto = { name: 'Updated Set A' };
      const mockLegoBox: LegoBox = {
        id: 1,
        name: 'Set A',
        totalPrice: 50,
        pieces: [],
        childBoxes: [],
      };

      legoBoxRepository.findOneBy.mockResolvedValue(mockLegoBox);
      legoBoxRepository.save.mockResolvedValue({
        ...mockLegoBox,
        ...updateLegoBoxDto,
      });
      eventWaiterService.emitAndWait.mockResolvedValue(1); // Simulate event response

      const result = await service.update(1, updateLegoBoxDto);

      expect(legoBoxRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(legoBoxRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'Updated Set A',
          totalPrice: 50,
        }),
      );
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'box.updated',
        expect.objectContaining({ id: 1, name: 'Updated Set A' }),
        'price.updated',
      );
      expect(result).toEqual({ id: 1, name: 'Updated Set A', totalPrice: 50 });
    });
  });

  describe('delete', () => {
    it('should delete a Lego box and wait for the box.priceUpdated event', async () => {
      legoBoxRepository.delete.mockResolvedValue({ affected: 1 } as any);
      eventWaiterService.emitAndWait.mockResolvedValue(1); // Simulate event response

      await service.delete(1);

      expect(legoBoxRepository.delete).toHaveBeenCalledWith(1);
      expect(eventWaiterService.emitAndWait).toHaveBeenCalledWith(
        'box.deleted',
        expect.objectContaining({ id: 1 }),
        'price.updated',
      );
    });

    it('should throw a NotFoundException if Lego box is not found', async () => {
      legoBoxRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(legoBoxRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
