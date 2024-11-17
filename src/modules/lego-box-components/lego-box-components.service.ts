import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegoBoxComponent } from 'src/infrastructure/database/entities/lego-box-component.entity';
import { CreateComponentDto } from './dtos/create-component.dto';
import { UpdateComponentDto } from './dtos/update-component.dto';
import { ComponentDto } from './dtos/component.dto';
import { AddComponentsDto } from './dtos/add-component.dto';

@Injectable()
export class LegoBoxComponentsService {
  constructor(
    @InjectRepository(LegoBoxComponent)
    private readonly legoBoxComponentRepository: Repository<LegoBoxComponent>,
  ) {}

  /**
   * Maps a LegoBoxComponent entity to a ComponentDto.
   * @param component - The LegoBoxComponent entity.
   * @returns The corresponding ComponentDto.
   */
  private mapToDto(component: LegoBoxComponent): ComponentDto {
    const { linked_component_id, component_type, quantity } = component;
    return {
      component_id: linked_component_id,
      component_type: component_type === 0 ? 'piece' : 'set',
      amount: quantity,
    };
  }

  /**
   * Add multiple components to a Lego box in batch.
   * @param addComponentsDto - DTO containing parent item ID and a list of components.
   */
  async addComponents(addComponentsDto: AddComponentsDto): Promise<void> {
    const { parent_item_id, components } = addComponentsDto;

    const componentEntities = components.map((component) =>
      this.legoBoxComponentRepository.create({
        lego_box_id: parent_item_id,
        linked_component_id: component.component_id,
        component_type: component.component_type === 'piece' ? 0 : 1,
        quantity: component.amount,
      }),
    );

    await this.legoBoxComponentRepository.save(componentEntities);
  }

  /**
   * Add a single component to a Lego box.
   * @param parentItemId - ID of the parent Lego Box to which the component is being added.
   * @param createComponentDto - DTO containing details of the component to be added.
   * @returns The created component as a DTO.
   */
  async createComponent(
    parentItemId: string,
    createComponentDto: CreateComponentDto,
  ): Promise<ComponentDto> {
    const componentEntity = this.legoBoxComponentRepository.create({
      lego_box_id: parentItemId,
      linked_component_id: createComponentDto.component_id,
      component_type: createComponentDto.component_type === 'piece' ? 0 : 1,
      quantity: createComponentDto.amount,
    });

    const savedComponent =
      await this.legoBoxComponentRepository.save(componentEntity);
    return this.mapToDto(savedComponent);
  }

  /**
   * Update an existing component in a Lego box.
   * @param id - The ID of the component to update.
   * @param updateComponentDto - DTO containing updated details of the component.
   * @returns The updated component as a DTO.
   * @throws NotFoundException if the component does not exist.
   */
  async updateComponent(
    id: string,
    updateComponentDto: UpdateComponentDto,
  ): Promise<ComponentDto> {
    const component = await this.legoBoxComponentRepository.findOneBy({
      lego_box_component_id: id,
    });

    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }

    Object.assign(component, {
      linked_component_id: updateComponentDto.component_id,
      component_type: updateComponentDto.component_type
        ? updateComponentDto.component_type === 'piece'
          ? 0
          : 1
        : undefined,
      quantity: updateComponentDto.amount,
    });

    const updatedComponent =
      await this.legoBoxComponentRepository.save(component);
    return this.mapToDto(updatedComponent);
  }

  /**
   * Delete a component from a Lego box.
   * @param id - The ID of the component to delete.
   * @throws NotFoundException if the component does not exist.
   */
  async deleteComponent(id: string): Promise<void> {
    const result = await this.legoBoxComponentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
  }

  /**
   * Retrieve all components for a specific Lego box.
   * @param parentItemId - The UUID of the parent Lego box.
   * @returns An array of components as DTOs.
   */
  async getComponentsByParentId(parentItemId: string): Promise<ComponentDto[]> {
    const components = await this.legoBoxComponentRepository.find({
      where: { lego_box_id: parentItemId },
    });

    return components.map(this.mapToDto);
  }
}
