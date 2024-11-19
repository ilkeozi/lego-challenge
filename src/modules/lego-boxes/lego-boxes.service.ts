import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateLegoBoxDto } from './dtos/create-lego-box.dto';
import { UpdateLegoBoxDto } from './dtos/update-lego-box.dto';
import { LegoBoxDto } from './dtos/lego-box.dto';
import { LegoBoxEvent } from './events/lego-box.event';
import { EventWaiterService } from 'src/core/services/event-waiter.service';

@Injectable()
export class LegoBoxesService {
  constructor(
    @InjectRepository(LegoBox)
    private readonly legoBoxRepository: Repository<LegoBox>,
    private readonly eventEmitter: EventEmitter2,
    private readonly eventWaiterService: EventWaiterService,
  ) {}

  /**
   * Maps a LegoBox entity to a LegoBoxDto.
   * Converts the internal database entity to a Data Transfer Object (DTO) for external use.
   *
   * @param {LegoBox} legoBox - The LegoBox entity to map.
   * @returns {LegoBoxDto} - The DTO representation of the LegoBox entity.
   */
  private mapToDto(legoBox: LegoBox): LegoBoxDto {
    const { id, name, totalPrice } = legoBox;
    return { id, name, totalPrice };
  }

  /**
   * Creates a new Lego box and emits a `box.created` event.
   *
   * @param {CreateLegoBoxDto} createLegoBoxDto - The data required to create a new Lego box.
   * @returns {Promise<LegoBoxDto>} - The created Lego box as a DTO.
   * @emits {LegoBoxEvent} - Emits an event containing the ID of the newly created Lego box.
   */
  async create(createLegoBoxDto: CreateLegoBoxDto): Promise<LegoBoxDto> {
    const legoBox = this.legoBoxRepository.create(createLegoBoxDto);
    const savedLegoBox = await this.legoBoxRepository.save(legoBox);

    await this.eventWaiterService.emitAndWait(
      'box.created',
      new LegoBoxEvent(savedLegoBox.id, savedLegoBox.name),
      'price.updated',
    );

    return this.mapToDto(savedLegoBox);
  }

  /**
   * Retrieves all Lego boxes.
   *
   * @returns {Promise<LegoBoxDto[]>} - An array of all Lego boxes as DTOs.
   */
  async findAll(): Promise<LegoBoxDto[]> {
    const legoBoxes = await this.legoBoxRepository.find();
    return legoBoxes.map(this.mapToDto);
  }

  /**
   * Retrieves a single Lego box by its ID.
   *
   * @param {number} id - The ID of the Lego box to retrieve.
   * @returns {Promise<LegoBoxDto>} - The requested Lego box as a DTO.
   * @throws {NotFoundException} - If the Lego box with the specified ID does not exist.
   */
  async findById(id: number): Promise<LegoBoxDto> {
    const legoBox = await this.legoBoxRepository.findOneBy({ id });
    if (!legoBox) {
      throw new NotFoundException(`LegoBox with ID ${id} not found`);
    }
    return this.mapToDto(legoBox);
  }

  /**
   * Updates an existing Lego box and emits a `box.updated` event.
   *
   * @param {number} id - The ID of the Lego box to update.
   * @param {UpdateLegoBoxDto} updateLegoBoxDto - The data to update the Lego box with.
   * @returns {Promise<LegoBoxDto>} - The updated Lego box as a DTO.
   * @throws {NotFoundException} - If the Lego box with the specified ID does not exist.
   * @emits {LegoBoxEvent} - Emits an event containing the ID of the updated Lego box.
   */
  async update(
    id: number,
    updateLegoBoxDto: UpdateLegoBoxDto,
  ): Promise<LegoBoxDto> {
    const legoBox = await this.findById(id);
    Object.assign(legoBox, updateLegoBoxDto);
    const updatedLegoBox = await this.legoBoxRepository.save(legoBox);

    await this.eventWaiterService.emitAndWait(
      'box.updated',
      new LegoBoxEvent(updatedLegoBox.id, updatedLegoBox.name),
      'price.updated',
    );

    return this.mapToDto(updatedLegoBox);
  }

  /**
   * Deletes a Lego box and emits a `box.deleted` event.
   *
   * @param {number} id - The ID of the Lego box to delete.
   * @throws {NotFoundException} - If the Lego box with the specified ID does not exist.
   * @emits {LegoBoxEvent} - Emits an event containing the ID of the deleted Lego box.
   */
  async delete(id: number): Promise<void> {
    const result = await this.legoBoxRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`LegoBox with ID ${id} not found`);
    }

    this.eventEmitter.emit('box.deleted', new LegoBoxEvent(id));
    await this.eventWaiterService.emitAndWait(
      'box.deleted',
      new LegoBoxEvent(id),
      'price.updated',
    );
  }
}
