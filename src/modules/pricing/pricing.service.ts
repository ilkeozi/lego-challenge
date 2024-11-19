import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';
import { NestedLegoBox } from 'src/infrastructure/database/entities/nested-lego-box.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LegoBoxEvent } from 'src/modules/lego-boxes/events/lego-box.event';
import { LegoBoxPiece } from 'src/infrastructure/database/entities/lego-box-piece.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(LegoBox)
    private readonly legoBoxRepository: Repository<LegoBox>,
    @InjectRepository(NestedLegoBox)
    private readonly nestedLegoBoxRepository: Repository<NestedLegoBox>,
    @InjectRepository(LegoBoxPiece)
    private readonly legoBoxPieceRepository: Repository<LegoBoxPiece>,
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  async recalculatePrices(boxId: number): Promise<void> {
    let finalBox: LegoBox | null = null;

    await this.dataSource.transaction(async (manager) => {
      await this.updateTotalPriceRecursive(boxId, manager);
      finalBox = await manager.findOne(LegoBox, { where: { id: boxId } });

      if (!finalBox) {
        throw new NotFoundException(`LegoBox with ID ${boxId} not found`);
      }
    });

    // Emit event after successful transaction
    if (finalBox) {
      this.eventEmitter.emit(
        'price.updated',
        new LegoBoxEvent(finalBox.id, finalBox.name, finalBox.totalPrice),
      );
    }
  }

  private async updateTotalPriceRecursive(
    boxId: number,
    manager: EntityManager,
  ): Promise<void> {
    const { totalPrice } = await this.calculateTotalPrice(boxId, manager);
    await this.updateTotalPrice(boxId, totalPrice, manager);

    const parentRelations = await manager.find(NestedLegoBox, {
      where: { childBox: { id: boxId } },
      relations: ['parentBox'],
    });

    for (const parentRelation of parentRelations) {
      await this.updateTotalPriceRecursive(
        parentRelation.parentBox.id,
        manager,
      );
    }
  }

  private async calculateTotalPrice(
    boxId: number,
    manager: EntityManager,
  ): Promise<{
    totalPrice: number;
    piecesTotal: number;
    nestedBoxesTotal: number;
  }> {
    const piecesTotal = await this.calculatePiecesTotal(boxId, manager);
    const nestedBoxesTotal = await this.calculateNestedBoxesTotal(
      boxId,
      manager,
    );

    return {
      totalPrice: piecesTotal + nestedBoxesTotal,
      piecesTotal,
      nestedBoxesTotal,
    };
  }

  private async updateTotalPrice(
    boxId: number,
    totalPrice: number,
    manager: EntityManager,
  ): Promise<void> {
    const box = await manager.findOne(LegoBox, { where: { id: boxId } });
    if (!box) {
      throw new NotFoundException(`LegoBox with ID ${boxId} not found`);
    }

    box.totalPrice = totalPrice;
    await manager.save(box);
  }

  private async calculatePiecesTotal(
    boxId: number,
    manager: EntityManager,
  ): Promise<number> {
    const pieces = await manager.find(LegoBoxPiece, {
      where: { box: { id: boxId } },
      relations: ['piece'],
    });

    return pieces.reduce(
      (total, piece) => total + piece.amount * piece.piece.price,
      0,
    );
  }

  private async calculateNestedBoxesTotal(
    boxId: number,
    manager: EntityManager,
  ): Promise<number> {
    const nestedBoxes = await manager.find(NestedLegoBox, {
      where: { parentBox: { id: boxId } },
      relations: ['childBox'],
    });

    return nestedBoxes.reduce((total, nestedBox) => {
      return total + (nestedBox.childBox?.totalPrice || 0) * nestedBox.amount;
    }, 0);
  }
}
