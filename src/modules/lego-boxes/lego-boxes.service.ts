import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LegoBoxRepository } from 'src/infrastructure/database/repositories/lego-box.repository';
import { CreateLegoBoxDto } from './dtos/create-lego-box.dto';
import { UpdateLegoBoxDto } from './dtos/update-lego-box.dto';
import { LegoBoxDto } from './dtos/lego-box.dto';
import { LegoBox } from 'src/infrastructure/database/entities/lego-box.entity';

@Injectable()
export class LegoBoxesService {
  constructor(
    @InjectRepository(LegoBoxRepository)
    private readonly legoBoxRepository: LegoBoxRepository,
  ) {}

  /**
   * Maps a LegoBox entity to a LegoBoxDto.
   * @param legoBox - The LegoBox entity.
   * @returns The corresponding LegoBoxDto.
   */
  private mapToDto(legoBox: LegoBox): LegoBoxDto {
    const { lego_box_id, name } = legoBox; // Only include fields in LegoBoxDto
    return { lego_box_id, name };
  }

  /**
   * Create a new Lego box.
   * @param createLegoBoxDto - DTO containing the name and direct price of the Lego box.
   * @returns The created Lego box as a DTO.
   */
  async create(createLegoBoxDto: CreateLegoBoxDto): Promise<LegoBoxDto> {
    const legoBox = this.legoBoxRepository.create(createLegoBoxDto);
    const savedLegoBox = await this.legoBoxRepository.save(legoBox);
    return this.mapToDto(savedLegoBox);
  }

  /**
   * Retrieve all Lego boxes.
   * @returns An array of all Lego boxes as DTOs.
   */
  async findAll(): Promise<LegoBoxDto[]> {
    const legoBoxes = await this.legoBoxRepository.find();
    return legoBoxes.map(this.mapToDto);
  }

  /**
   * Retrieve a single Lego box by ID.
   * @param id - The UUID of the Lego box.
   * @returns The requested Lego box as a DTO.
   * @throws NotFoundException if the Lego box does not exist.
   */
  async findById(id: string): Promise<LegoBoxDto> {
    const legoBox = await this.legoBoxRepository.findOneBy({ lego_box_id: id });
    if (!legoBox) {
      throw new NotFoundException(`LegoBox with ID ${id} not found`);
    }
    return this.mapToDto(legoBox);
  }

  /**
   * Update an existing Lego box.
   * @param id - The UUID of the Lego box to update.
   * @param updateLegoBoxDto - DTO containing the fields to update.
   * @returns The updated Lego box as a DTO.
   * @throws NotFoundException if the Lego box does not exist.
   */
  async update(
    id: string,
    updateLegoBoxDto: UpdateLegoBoxDto,
  ): Promise<LegoBoxDto> {
    const legoBox = await this.findById(id);
    Object.assign(legoBox, updateLegoBoxDto);
    const updatedLegoBox = await this.legoBoxRepository.save(legoBox);
    return this.mapToDto(updatedLegoBox);
  }

  /**
   * Delete a Lego box by ID.
   * @param id - The UUID of the Lego box to delete.
   * @throws NotFoundException if the Lego box does not exist.
   */
  async delete(id: string): Promise<void> {
    const result = await this.legoBoxRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`LegoBox with ID ${id} not found`);
    }
  }

  /**
   * Calculate and return the total price of a Lego box.
   * @param id - The UUID of the Lego box.
   * @returns The total price (direct + nested).
   */
  async getTotalPrice(id: string): Promise<number> {
    return await this.legoBoxRepository.getTotalPrice(id);
  }

  /**
   * Update the direct price of a Lego box.
   * @param id - The UUID of the Lego box.
   */
  async updateDirectPrice(id: string): Promise<void> {
    await this.legoBoxRepository.updateDirectPrice(id);
  }

  /**
   * Update the nested price of a Lego box.
   * @param id - The UUID of the Lego box.
   */
  async updateNestedPrice(id: string): Promise<void> {
    await this.legoBoxRepository.updateNestedPrice(id);
  }

  /**
   * Refresh the materialized view for Lego box price aggregation.
   */
  async refreshMaterializedView(): Promise<void> {
    await this.legoBoxRepository.refreshMaterializedView();
  }
}
