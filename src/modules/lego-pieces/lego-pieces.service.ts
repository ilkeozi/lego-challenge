import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LegoPiece } from 'src/infrastructure/database/entities/lego-piece.entity';
import { Repository } from 'typeorm';
import { CreateLegoPieceDto } from './dtos/create-lego-piece.dto';
import { UpdateLegoPieceDto } from './dtos/update-lego-piece.dto';
import { LegoPieceDto } from './dtos/lego-piece.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LegoPieceEvent } from './events/lego-piece.event';

@Injectable()
export class LegoPiecesService {
  constructor(
    @InjectRepository(LegoPiece)
    private readonly legoPieceRepository: Repository<LegoPiece>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Maps a LegoPiece entity to a LegoPieceDto.
   * @param legoPiece - The LegoPiece entity.
   * @returns The corresponding LegoPieceDto.
   */
  private mapToDto(legoPiece: LegoPiece): LegoPieceDto {
    const { id, name, price } = legoPiece;
    return { id, name, price };
  }

  /**
   * Create a new Lego piece.
   * @param createLegoPieceDto - DTO containing the name and price of the Lego piece.
   * @returns The created Lego piece as a DTO.
   */
  async create(createLegoPieceDto: CreateLegoPieceDto): Promise<LegoPieceDto> {
    const legoPiece = this.legoPieceRepository.create(createLegoPieceDto);
    const savedLegoPiece = await this.legoPieceRepository.save(legoPiece);
    this.eventEmitter.emit(
      'legoPiece.created',
      new LegoPieceEvent(savedLegoPiece.id),
    );
    return this.mapToDto(savedLegoPiece);
  }

  /**
   * Retrieve all Lego pieces.
   * @returns An array of Lego pieces as DTOs.
   */
  async findAll(): Promise<LegoPieceDto[]> {
    const legoPieces = await this.legoPieceRepository.find();
    return legoPieces.map(this.mapToDto);
  }

  /**
   * Retrieve a single Lego piece by ID.
   * @param id - The UUID of the Lego piece.
   * @returns The requested Lego piece as a DTO.
   * @throws NotFoundException if the Lego piece does not exist.
   */
  async findById(id: number): Promise<LegoPieceDto> {
    const legoPiece = await this.legoPieceRepository.findOneBy({
      id: id,
    });
    if (!legoPiece) {
      throw new NotFoundException(`LegoPiece with ID ${id} not found`);
    }
    return this.mapToDto(legoPiece);
  }

  /**
   * Update an existing Lego piece.
   * @param id - The UUID of the Lego piece to update.
   * @param updateLegoPieceDto - DTO containing the fields to update.
   * @returns The updated Lego piece as a DTO.
   * @throws NotFoundException if the Lego piece does not exist.
   */
  async update(
    id: number,
    updateLegoPieceDto: UpdateLegoPieceDto,
  ): Promise<LegoPieceDto> {
    const legoPiece = await this.findById(id);
    Object.assign(legoPiece, updateLegoPieceDto);
    const updatedLegoPiece = await this.legoPieceRepository.save(legoPiece);
    this.eventEmitter.emit(
      'legoPiece.updated',
      new LegoPieceEvent(updatedLegoPiece.id),
    );
    return this.mapToDto(updatedLegoPiece);
  }

  /**
   * Delete a Lego piece by ID.
   * @param id - The UUID of the Lego piece to delete.
   * @throws NotFoundException if the Lego piece does not exist.
   */
  async delete(id: number): Promise<void> {
    const result = await this.legoPieceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`LegoPiece with ID ${id} not found`);
    }
    this.eventEmitter.emit('legoPiece.deleted', new LegoPieceEvent(id));
  }
}
