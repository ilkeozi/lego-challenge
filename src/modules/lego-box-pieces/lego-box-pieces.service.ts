import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegoBoxPiece } from 'src/infrastructure/database/entities/lego-box-piece.entity';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';
import { CreateLegoBoxPieceDto } from './dtos/create-lego-box-piece.dto';
import { UpdateLegoBoxPieceDto } from './dtos/update-lego-box-piece.dto';
import { LegoBoxPieceDto } from './dtos/lego-box-piece.dto';
import { LegoBoxPieceEvent } from './events/lego-box-piece.event';
import { EventWaiterService } from 'src/core/services/event-waiter.service';

@Injectable()
export class LegoBoxPiecesService {
  constructor(
    @InjectRepository(LegoBoxPiece)
    private readonly legoBoxPieceRepository: Repository<LegoBoxPiece>,
    @InjectRepository(LegoBox)
    private readonly legoBoxRepository: Repository<LegoBox>,
    private readonly eventWaiterService: EventWaiterService,
  ) {}

  async create(dto: CreateLegoBoxPieceDto): Promise<LegoBoxPieceDto> {
    const box = await this.legoBoxRepository.findOneBy({ id: dto.boxId });
    if (!box) {
      throw new NotFoundException(`LegoBox with ID ${dto.boxId} not found`);
    }

    const legoPiece = await this.legoBoxPieceRepository.manager.findOne(
      'LegoPiece',
      { where: { id: dto.pieceId } },
    );
    if (!legoPiece) {
      throw new NotFoundException(`LegoPiece with ID ${dto.pieceId} not found`);
    }

    const legoBoxPiece = this.legoBoxPieceRepository.create({
      box,
      piece: legoPiece,
      amount: dto.amount,
    });

    const savedPiece = await this.legoBoxPieceRepository.save(legoBoxPiece);

    await this.eventWaiterService.emitAndWait(
      'boxPiece.added',
      new LegoBoxPieceEvent(box.id, legoPiece.id, dto.amount),
      'price.updated',
    );

    return this.mapToDto(savedPiece);
  }

  async findAllByBoxId(boxId: number): Promise<LegoBoxPieceDto[]> {
    const pieces = await this.legoBoxPieceRepository.find({
      where: { box: { id: boxId } },
      relations: ['piece'],
    });

    return pieces.map((piece) => this.mapToDto(piece));
  }

  async update(
    id: number,
    dto: UpdateLegoBoxPieceDto,
  ): Promise<LegoBoxPieceDto> {
    const piece = await this.legoBoxPieceRepository.findOne({
      where: { id },
      relations: ['box', 'piece'],
    });

    if (!piece) {
      throw new NotFoundException(`LegoBoxPiece with ID ${id} not found`);
    }

    if (dto.amount) {
      piece.amount = dto.amount;
    } else {
      throw new Error('Amount must be provided to update the LegoBoxPiece.');
    }

    const updatedPiece = await this.legoBoxPieceRepository.save(piece);

    await this.eventWaiterService.emitAndWait(
      'boxPiece.updated',
      new LegoBoxPieceEvent(
        updatedPiece.box.id,
        piece.piece.id,
        updatedPiece.amount,
      ),
      'price.updated',
    );

    return this.mapToDto(updatedPiece);
  }

  async delete(id: number): Promise<void> {
    const piece = await this.legoBoxPieceRepository.findOne({
      where: { id },
      relations: ['box', 'piece'],
    });

    if (!piece) {
      throw new NotFoundException(`LegoBoxPiece with ID ${id} not found`);
    }

    await this.legoBoxPieceRepository.remove(piece);

    await this.eventWaiterService.emitAndWait(
      'boxPiece.deleted',
      new LegoBoxPieceEvent(piece.box.id, piece.piece.id),

      'price.updated',
    );
  }

  private mapToDto(piece: LegoBoxPiece): LegoBoxPieceDto {
    const { id, box, piece: legoPiece, amount } = piece;
    return {
      id,
      boxId: box.id,
      pieceId: legoPiece.id,
      amount,
    };
  }
}
