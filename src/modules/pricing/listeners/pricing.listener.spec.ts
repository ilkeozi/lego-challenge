import { Test, TestingModule } from '@nestjs/testing';
import { PricingListener } from './pricing.listener';
import { PricingService } from '../pricing.service';
import { LegoBoxesService } from 'src/modules/lego-boxes/lego-boxes.service';
import { LegoBoxEvent } from 'src/modules/lego-boxes/events/lego-box.event';
import { LegoBoxPieceEvent } from 'src/modules/lego-box-pieces/events/lego-box-piece.event';
import { NestedBoxEvent } from 'src/modules/nested-lego-boxes/events/nested-box.event';

describe('PricingListener', () => {
  let listener: PricingListener;
  let pricingService: jest.Mocked<PricingService>;
  let legoBoxesService: jest.Mocked<LegoBoxesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingListener,
        {
          provide: PricingService,
          useValue: {
            calculateTotalPrice: jest.fn(),
          },
        },
        {
          provide: LegoBoxesService,
          useValue: {
            updateTotalPrice: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<PricingListener>(PricingListener);
    pricingService = module.get(PricingService) as jest.Mocked<PricingService>;
    legoBoxesService = module.get(
      LegoBoxesService,
    ) as jest.Mocked<LegoBoxesService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('handleBoxEvent', () => {
    it('should calculate total price and update the LegoBox', async () => {
      const payload: LegoBoxEvent = { id: 1, name: 'Test Box' };
      const mockTotalPrice = {
        totalPrice: 100,
        piecesTotal: 60,
        nestedBoxesTotal: 40,
      };

      pricingService.calculateTotalPrice.mockResolvedValue(mockTotalPrice);

      await listener.handleBoxEvent(payload);

      expect(pricingService.calculateTotalPrice).toHaveBeenCalledWith(
        payload.id,
      );
      expect(legoBoxesService.updateTotalPrice).toHaveBeenCalledWith(
        payload.id,
        mockTotalPrice.totalPrice,
      );
    });
  });

  describe('handleBoxPieceEvent', () => {
    it('should calculate total price and update the LegoBox for boxPiece.* events', async () => {
      const payload: LegoBoxPieceEvent = { boxId: 2, pieceId: 1 };
      const mockTotalPrice = {
        totalPrice: 150,
        piecesTotal: 100,
        nestedBoxesTotal: 50,
      };

      pricingService.calculateTotalPrice.mockResolvedValue(mockTotalPrice);

      await listener.handleBoxPieceEvent(payload);

      expect(pricingService.calculateTotalPrice).toHaveBeenCalledWith(
        payload.boxId,
      );
      expect(legoBoxesService.updateTotalPrice).toHaveBeenCalledWith(
        payload.boxId,
        mockTotalPrice.totalPrice,
      );
    });
  });

  describe('handleNestedBoxEvent', () => {
    it('should calculate total price and update the parent LegoBox for nestedBox.* events', async () => {
      const payload: NestedBoxEvent = {
        id: 1,
        parentBoxId: 3,
        childBoxId: 2,
        amount: 5,
      };
      const mockTotalPrice = {
        totalPrice: 200,
        piecesTotal: 120,
        nestedBoxesTotal: 80,
      };

      pricingService.calculateTotalPrice.mockResolvedValue(mockTotalPrice);

      await listener.handleNestedBoxEvent(payload);

      expect(pricingService.calculateTotalPrice).toHaveBeenCalledWith(
        payload.parentBoxId,
      );
      expect(legoBoxesService.updateTotalPrice).toHaveBeenCalledWith(
        payload.parentBoxId,
        mockTotalPrice.totalPrice,
      );
    });
  });
});
