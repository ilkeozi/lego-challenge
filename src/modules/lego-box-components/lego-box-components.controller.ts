import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LegoBoxComponentsService } from './lego-box-components.service';
import { AddComponentsDto } from './dtos/add-component.dto';
import { CreateComponentDto } from './dtos/create-component.dto';
import { UpdateComponentDto } from './dtos/update-component.dto';
import { ComponentDto } from './dtos/component.dto';

@ApiTags('Lego Box Components')
@Controller('lego-box-components')
export class LegoBoxComponentsController {
  constructor(
    private readonly legoBoxComponentsService: LegoBoxComponentsService,
  ) {}

  @ApiOperation({ summary: 'Add multiple components to a Lego box' })
  @ApiResponse({
    status: 200,
    description: 'The components have been successfully added.',
  })
  @Post('batch')
  async addComponents(
    @Body() addComponentsDto: AddComponentsDto,
  ): Promise<void> {
    return this.legoBoxComponentsService.addComponents(addComponentsDto);
  }

  @ApiOperation({ summary: 'Add a single component to a Lego box' })
  @ApiParam({
    name: 'parentItemId',
    description: 'ID of the parent Lego box',
  })
  @ApiResponse({
    status: 201,
    description: 'The component has been successfully added.',
    type: ComponentDto,
  })
  @Post(':parentItemId')
  async createComponent(
    @Param('parentItemId') parentItemId: string,
    @Body() createComponentDto: CreateComponentDto,
  ): Promise<ComponentDto> {
    return this.legoBoxComponentsService.createComponent(
      parentItemId,
      createComponentDto,
    );
  }

  @ApiOperation({ summary: 'Retrieve all components for a specific Lego box' })
  @ApiParam({
    name: 'parentItemId',
    description: 'ID of the parent Lego box',
  })
  @ApiResponse({
    status: 200,
    description: 'An array of components for the specified Lego box.',
    type: [ComponentDto],
  })
  @Get(':parentItemId')
  async getComponentsByParentId(
    @Param('parentItemId') parentItemId: string,
  ): Promise<ComponentDto[]> {
    return this.legoBoxComponentsService.getComponentsByParentId(parentItemId);
  }

  @ApiOperation({ summary: 'Update an existing component in a Lego box' })
  @ApiParam({
    name: 'id',
    description: 'ID of the component to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The component has been successfully updated.',
    type: ComponentDto,
  })
  @ApiResponse({ status: 404, description: 'Component not found' })
  @Put(':id')
  async updateComponent(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
  ): Promise<ComponentDto> {
    return this.legoBoxComponentsService.updateComponent(
      id,
      updateComponentDto,
    );
  }

  @ApiOperation({ summary: 'Delete a component from a Lego box' })
  @ApiParam({
    name: 'id',
    description: 'ID of the component to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The component has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Component not found' })
  @Delete(':id')
  async deleteComponent(@Param('id') id: string): Promise<void> {
    return this.legoBoxComponentsService.deleteComponent(id);
  }
}
