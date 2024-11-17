import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { LegoBoxesService } from './lego-boxes.service';
import { CreateLegoBoxDto } from './dtos/create-lego-box.dto';
import { LegoBoxDto } from './dtos/lego-box.dto';
import { UpdateLegoBoxDto } from './dtos/update-lego-box.dto';
import { LegoBoxComponentsService } from '../lego-box-components/lego-box-components.service';
import { ComponentDto } from '../lego-box-components/dtos/component.dto';
import { CreateComponentDto } from '../lego-box-components/dtos/create-component.dto';
import { UpdateComponentDto } from '../lego-box-components/dtos/update-component.dto';
import { ApiValidationErrorResponse } from 'src/common/decorators/api-validation-error-response.decorator';

@ApiTags('Lego Boxes')
@Controller('lego-boxes')
export class LegoBoxesController {
  constructor(
    private readonly legoBoxesService: LegoBoxesService,
    private readonly legoBoxComponentsService: LegoBoxComponentsService,
  ) {}

  @ApiOperation({ summary: 'Create a new Lego box' })
  @ApiResponse({
    status: 201,
    description: 'The Lego box has been successfully created.',
    type: LegoBoxDto,
  })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Post()
  async create(
    @Body() createLegoBoxDto: CreateLegoBoxDto,
  ): Promise<LegoBoxDto> {
    return this.legoBoxesService.create(createLegoBoxDto);
  }

  @ApiOperation({ summary: 'Retrieve all Lego boxes' })
  @ApiResponse({
    status: 200,
    description: 'An array of Lego boxes',
    type: [LegoBoxDto],
  })
  @Get()
  async findAll(): Promise<LegoBoxDto[]> {
    return this.legoBoxesService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a Lego box by ID' })
  @ApiParam({ name: 'id', description: 'ID of the Lego box' })
  @ApiResponse({
    status: 200,
    description: 'The requested Lego box',
    type: LegoBoxDto,
  })
  @ApiResponse({ status: 404, description: 'Lego box not found' })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LegoBoxDto> {
    return this.legoBoxesService.findById(id);
  }

  @ApiOperation({ summary: 'Update an existing Lego box' })
  @ApiParam({ name: 'id', description: 'ID of the Lego box to update' })
  @ApiResponse({
    status: 200,
    description: 'The updated Lego box',
    type: LegoBoxDto,
  })
  @ApiResponse({ status: 404, description: 'Lego box not found' })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLegoBoxDto: UpdateLegoBoxDto,
  ): Promise<LegoBoxDto> {
    return this.legoBoxesService.update(id, updateLegoBoxDto);
  }

  @ApiOperation({ summary: 'Delete a Lego box' })
  @ApiParam({ name: 'id', description: 'ID of the Lego box to delete' })
  @ApiResponse({ status: 200, description: 'The Lego box has been deleted.' })
  @ApiResponse({ status: 404, description: 'Lego box not found' })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.legoBoxesService.delete(id);
  }

  @ApiOperation({ summary: 'Retrieve all components for a specific Lego box' })
  @ApiParam({
    name: 'id',
    description: 'ID of the Lego box for which components are being retrieved',
  })
  @ApiResponse({
    status: 200,
    description: 'An array of components for the specified Lego box.',
    type: [ComponentDto],
  })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Get(':id/components')
  async getComponentsByParentId(
    @Param('id') parentItemId: string,
  ): Promise<ComponentDto[]> {
    return this.legoBoxComponentsService.getComponentsByParentId(parentItemId);
  }

  @ApiOperation({ summary: 'Add a single component to a Lego box' })
  @ApiParam({
    name: 'id',
    description: 'ID of the Lego box to which the component is being added',
  })
  @ApiResponse({
    status: 201,
    description: 'The component has been successfully added.',
    type: ComponentDto,
  })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Post(':id/components')
  async createComponent(
    @Param('id') parentItemId: string,
    @Body() createComponentDto: CreateComponentDto,
  ): Promise<ComponentDto> {
    return this.legoBoxComponentsService.createComponent(
      parentItemId,
      createComponentDto,
    );
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
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Put(':legoBoxId/components/:id')
  async updateComponent(
    @Param('legoBoxId') legoBoxId: string,
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
    name: 'legoBoxId',
    description: 'ID of the Lego box containing the component',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the component to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The component has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Component not found',
  })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Delete(':legoBoxId/components/:id')
  async deleteComponent(
    @Param('legoBoxId') legoBoxId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.legoBoxComponentsService.deleteComponent(id);
  }
}
