import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegoBoxPiece } from 'src/infrastructure/database/entities/lego-box-piece.entity';
import { NestedLegoBox } from 'src/infrastructure/database/entities/nested-lego-box.entity';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(LegoBoxPiece)
    private readonly legoBoxPieceRepository: Repository<LegoBoxPiece>,
    @InjectRepository(NestedLegoBox)
    private readonly nestedLegoBoxRepository: Repository<NestedLegoBox>,
    @InjectRepository(LegoBox)
    private readonly legoBoxRepository: Repository<LegoBox>,
  ) {}

  /**
   * Calculate the total price for a LegoBox, including its pieces and nested boxes.
   */
  async calculateTotalPrice(boxId: number): Promise<{
    totalPrice: number;
    piecesTotal: number;
    nestedBoxesTotal: number;
  }> {
    const pieces = await this.findPieces(boxId);
    const nestedBoxes = await this.findNestedBoxes(boxId);

    const piecesTotal = this.calculatePiecesTotal(pieces);
    const nestedBoxesTotal = await this.calculateNestedBoxesTotal(nestedBoxes);

    return {
      totalPrice: piecesTotal + nestedBoxesTotal,
      piecesTotal,
      nestedBoxesTotal,
    };
  }

  /**
   * Fetch pieces for the specified LegoBox.
   */
  private async findPieces(boxId: number): Promise<LegoBoxPiece[]> {
    return this.legoBoxPieceRepository.find({
      where: { box: { id: boxId } },
      relations: ['piece'], // Eager load related piece data
    });
  }

  /**
   * Fetch nested boxes for the specified LegoBox.
   */
  private async findNestedBoxes(boxId: number): Promise<NestedLegoBox[]> {
    return this.nestedLegoBoxRepository.find({
      where: { parentBox: { id: boxId } },
      relations: ['childBox'], // Eager load related child box data
    });
  }

  /**
   * Calculate the total price of pieces in a LegoBox.
   */
  private calculatePiecesTotal(pieces: LegoBoxPiece[]): number {
    return pieces.reduce(
      (total, piece) => total + piece.amount * piece.piece.price,
      0,
    );
  }

  /**
   * Calculate the total price of nested LegoBoxes.
   */
  private async calculateNestedBoxesTotal(
    nestedBoxes: NestedLegoBox[],
  ): Promise<number> {
    const nestedBoxesTotals = await Promise.all(
      nestedBoxes.map(async (nestedBox) => {
        const childBox = await this.legoBoxRepository.findOneBy({
          id: nestedBox.childBox.id,
        });
        return (childBox?.totalPrice || 0) * nestedBox.amount;
      }),
    );
    return nestedBoxesTotals.reduce((sum, price) => sum + price, 0);
  }
}
