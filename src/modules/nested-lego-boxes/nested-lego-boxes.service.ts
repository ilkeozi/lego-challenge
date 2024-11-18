import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NestedLegoBox } from 'src/infrastructure/database/entities/nested-lego-box.entity';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';
import { CreateNestedLegoBoxDto } from './dtos/create-nested-lego-box.dto';
import { UpdateNestedLegoBoxDto } from './dtos/update-nested-lego-box.dto';
import { NestedLegoBoxDto } from './dtos/nested-lego-box.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NestedBoxEvent } from './events/nested-box.event';
import { EventWaiterService } from 'src/core/services/event-waiter.service';

@Injectable()
export class NestedLegoBoxesService {
  constructor(
    @InjectRepository(NestedLegoBox)
    private readonly nestedLegoBoxRepository: Repository<NestedLegoBox>,
    @InjectRepository(LegoBox)
    private readonly legoBoxRepository: Repository<LegoBox>,
    private readonly eventEmitter: EventEmitter2,
    private readonly eventWaiterService: EventWaiterService,
  ) {}

  /**
   * Creates a new NestedLegoBox and associates it with parent and child Lego boxes.
   * Emits a 'nestedBox.added' event upon successful creation.
   * @param dto - The data transfer object containing the details of the NestedLegoBox to create.
   * @returns The created NestedLegoBox as a DTO.
   * @throws NotFoundException if the specified parent or child Lego box does not exist.
   */
  async create(dto: CreateNestedLegoBoxDto): Promise<NestedLegoBoxDto> {
    const parentBox = await this.legoBoxRepository.findOneBy({
      id: dto.parentBoxId,
    });
    if (!parentBox) {
      throw new NotFoundException(
        `Parent LegoBox with ID ${dto.parentBoxId} not found`,
      );
    }

    const childBox = await this.legoBoxRepository.findOneBy({
      id: dto.childBoxId,
    });
    if (!childBox) {
      throw new NotFoundException(
        `Child LegoBox with ID ${dto.childBoxId} not found`,
      );
    }

    const nestedLegoBox = this.nestedLegoBoxRepository.create({
      parentBox,
      childBox,
      amount: dto.amount,
    });

    const savedNestedLegoBox =
      await this.nestedLegoBoxRepository.save(nestedLegoBox);

    await this.eventWaiterService.emitAndWait(
      'nestedBox.added',
      new NestedBoxEvent(
        savedNestedLegoBox.id,
        dto.parentBoxId,
        dto.childBoxId,
        dto.amount,
      ),
      'box.priceUpdated',
      (payload) => payload === dto.parentBoxId,
      1000,
    );

    return this.mapToDto(savedNestedLegoBox);
  }

  /**
   * Retrieves all NestedLegoBoxes associated with a specific parent Lego box.
   * @param parentBoxId - The ID of the parent Lego box.
   * @returns An array of NestedLegoBoxes as DTOs.
   */
  async findAllByParentBoxId(parentBoxId: number): Promise<NestedLegoBoxDto[]> {
    const nestedBoxes = await this.nestedLegoBoxRepository.find({
      where: { parentBox: { id: parentBoxId } },
      relations: ['childBox'],
    });

    return nestedBoxes.map((nestedBox) => this.mapToDto(nestedBox));
  }

  /**
   * Updates the amount of an existing NestedLegoBox.
   * Emits a 'nestedBox.updated' event upon successful update.
   * @param id - The ID of the NestedLegoBox to update.
   * @param dto - The data transfer object containing the updated amount.
   * @returns The updated NestedLegoBox as a DTO.
   * @throws NotFoundException if the NestedLegoBox does not exist.
   */
  async update(
    id: number,
    dto: UpdateNestedLegoBoxDto,
  ): Promise<NestedLegoBoxDto> {
    const nestedBox = await this.nestedLegoBoxRepository.findOne({
      where: { id },
      relations: ['parentBox', 'childBox'],
    });

    if (!nestedBox) {
      throw new NotFoundException(`NestedLegoBox with ID ${id} not found`);
    }

    if (!dto.amount) {
      throw new Error('Amount must be provided to update the NestedLegoBox.');
    }

    nestedBox.amount = dto.amount;

    const updatedNestedBox = await this.nestedLegoBoxRepository.save(nestedBox);

    await this.eventWaiterService.emitAndWait(
      'nestedBox.updated',
      new NestedBoxEvent(
        updatedNestedBox.id,
        nestedBox.parentBox.id,
        nestedBox.childBox.id,
        updatedNestedBox.amount,
      ),
      'box.priceUpdated',
      (payload) => payload === nestedBox.parentBox.id,
      1000,
    );

    return this.mapToDto(updatedNestedBox);
  }

  /**
   * Deletes a NestedLegoBox by its ID.
   * Emits a 'nestedBox.removed' event upon successful deletion.
   * @param id - The ID of the NestedLegoBox to delete.
   * @throws NotFoundException if the NestedLegoBox does not exist.
   */
  async delete(id: number): Promise<void> {
    const nestedBox = await this.nestedLegoBoxRepository.findOne({
      where: { id },
      relations: ['parentBox', 'childBox'],
    });

    if (!nestedBox) {
      throw new NotFoundException(`NestedLegoBox with ID ${id} not found`);
    }

    await this.nestedLegoBoxRepository.delete(id);

    await this.eventWaiterService.emitAndWait(
      'nestedBox.removed',
      new NestedBoxEvent(
        nestedBox.id,
        nestedBox.parentBox.id,
        nestedBox.childBox.id,
        nestedBox.amount,
      ),
      'box.priceUpdated',
      (payload) => payload === nestedBox.parentBox.id,
      1000,
    );
  }

  /**
   * Maps a NestedLegoBox entity to a NestedLegoBoxDto.
   * @param nestedBox - The NestedLegoBox entity to map.
   * @returns The corresponding NestedLegoBoxDto.
   */
  private mapToDto(nestedBox: NestedLegoBox): NestedLegoBoxDto {
    const { id, parentBox, childBox, amount } = nestedBox;
    return {
      id,
      parentBoxId: parentBox.id,
      childBoxId: childBox.id,
      amount,
    };
  }
}
