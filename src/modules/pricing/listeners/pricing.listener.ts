import { Injectable, BadRequestException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PricingService } from '../pricing.service';
import { LegoBoxesService } from 'src/modules/lego-boxes/lego-boxes.service';
import { NestedBoxEvent } from 'src/modules/nested-lego-boxes/events/nested-box.event';
import { LegoBoxEvent } from 'src/modules/lego-boxes/events/lego-box.event';
import { LegoBoxPieceEvent } from 'src/modules/lego-box-pieces/events/lego-box-piece.event';

@Injectable()
export class PricingListener {
  constructor(
    private readonly pricingService: PricingService,
    private readonly legoBoxesService: LegoBoxesService,
  ) {}

  /**
   * Handles events related to LegoBox actions and updates total price.
   * @param payload - The event payload containing details of the affected Lego box.
   */
  @OnEvent('box.*', { async: true })
  async handleBoxEvent(payload: LegoBoxEvent): Promise<void> {
    if (!payload.id) {
      throw new BadRequestException(
        `Event box.* must contain a valid boxId in the payload.`,
      );
    }

    const { totalPrice } = await this.pricingService.calculateTotalPrice(
      payload.id,
    );
    await this.legoBoxesService.updateTotalPrice(payload.id, totalPrice);
  }

  /**
   * Handles events related to LegoBoxPiece actions and updates the parent box's total price.
   * @param payload - The event payload containing details of the affected piece.
   */
  @OnEvent('boxPiece.*', { async: true })
  async handleBoxPieceEvent(payload: LegoBoxPieceEvent): Promise<void> {
    if (!payload.boxId) {
      throw new BadRequestException(
        `Event boxPiece.* must contain a valid boxId in the payload.`,
      );
    }

    const { totalPrice } = await this.pricingService.calculateTotalPrice(
      payload.boxId,
    );
    await this.legoBoxesService.updateTotalPrice(payload.boxId, totalPrice);
  }

  /**
   * Handles events related to NestedLegoBox actions and updates the parent box's total price.
   * @param payload - The event payload containing details of the affected nested box.
   */
  @OnEvent('nestedBox.*', { async: true })
  async handleNestedBoxEvent(payload: NestedBoxEvent): Promise<void> {
    if (!payload.parentBoxId) {
      throw new BadRequestException(
        `Event nestedBox.* must contain a valid parentBoxId in the payload.`,
      );
    }

    const { totalPrice } = await this.pricingService.calculateTotalPrice(
      payload.parentBoxId,
    );
    await this.legoBoxesService.updateTotalPrice(
      payload.parentBoxId,
      totalPrice,
    );
  }
}
