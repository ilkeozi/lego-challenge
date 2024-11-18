import {
  Controller,
  Get,
  Post,
  Patch,
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
import { LegoBoxPieceDto } from '../lego-box-pieces/dtos/lego-box-piece.dto';
import { CreateLegoBoxPieceDto } from '../lego-box-pieces/dtos/create-lego-box-piece.dto';
import { UpdateLegoBoxPieceDto } from '../lego-box-pieces/dtos/update-lego-box-piece.dto';
import { ApiValidationErrorResponse } from 'src/common/decorators/api-validation-error-response.decorator';
import { LegoBoxPiecesService } from '../lego-box-pieces/lego-box-pieces.service';
import { NestedLegoBoxesService } from '../nested-lego-boxes/nested-lego-boxes.service';
import { CreateNestedLegoBoxDto } from '../nested-lego-boxes/dtos/create-nested-lego-box.dto';
import { NestedLegoBoxDto } from '../nested-lego-boxes/dtos/nested-lego-box.dto';
import { UpdateNestedLegoBoxDto } from '../nested-lego-boxes/dtos/update-nested-lego-box.dto';

@ApiTags('Lego Boxes')
@Controller('lego-boxes')
export class LegoBoxesController {
  constructor(
    private readonly legoBoxesService: LegoBoxesService,
    private readonly legoBoxPiecesService: LegoBoxPiecesService,
    private readonly nestedLegoBoxesService: NestedLegoBoxesService,
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
  async findOne(@Param('id') id: number): Promise<LegoBoxDto> {
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
    @Param('id') id: number,
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
  async delete(@Param('id') id: number): Promise<void> {
    return this.legoBoxesService.delete(id);
  }

  @ApiOperation({ summary: 'Retrieve all pieces in a Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the Lego box' })
  @ApiResponse({
    status: 200,
    description: 'An array of pieces in the Lego box',
    type: [LegoBoxPieceDto],
  })
  @Get(':boxId/pieces')
  async findPieces(@Param('boxId') boxId: number): Promise<LegoBoxPieceDto[]> {
    return this.legoBoxPiecesService.findAllByBoxId(boxId);
  }

  @ApiOperation({ summary: 'Add a piece to a Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the Lego box' })
  @ApiResponse({
    status: 201,
    description: 'The piece has been successfully added to the Lego box.',
    type: LegoBoxPieceDto,
  })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Post(':boxId/pieces')
  async addPiece(
    @Param('boxId') boxId: number,
    @Body() createLegoBoxPieceDto: CreateLegoBoxPieceDto,
  ): Promise<LegoBoxPieceDto> {
    return this.legoBoxPiecesService.create(createLegoBoxPieceDto);
  }

  @ApiOperation({ summary: 'Update the amount of a piece in a Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the Lego box' })
  @ApiParam({
    name: 'relationId',
    description: 'ID of the Lego box piece relation',
  })
  @ApiResponse({
    status: 200,
    description: 'The piece in the Lego box has been successfully updated',
    type: LegoBoxPieceDto,
  })
  @ApiResponse({ status: 404, description: 'LegoBoxPiece not found' })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Patch(':boxId/pieces/:relationId')
  async updatePieceAmount(
    @Param('boxId') boxId: number,
    @Param('relationId') relationId: number,
    @Body() updateLegoBoxPieceDto: UpdateLegoBoxPieceDto,
  ): Promise<LegoBoxPieceDto> {
    return this.legoBoxPiecesService.update(relationId, updateLegoBoxPieceDto);
  }

  @ApiOperation({ summary: 'Remove a piece from a Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the Lego box' })
  @ApiParam({
    name: 'relationId',
    description: 'ID of the Lego box piece relation',
  })
  @ApiResponse({
    status: 200,
    description: 'The piece has been successfully removed from the Lego box.',
  })
  @ApiResponse({ status: 404, description: 'LegoBoxPiece not found' })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Delete(':boxId/pieces/:relationId')
  async removePiece(
    @Param('boxId') boxId: number,
    @Param('relationId') relationId: number,
  ): Promise<void> {
    return this.legoBoxPiecesService.delete(relationId);
  }

  @ApiOperation({ summary: 'Retrieve all nested Lego boxes for a Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the parent Lego box' })
  @ApiResponse({
    status: 200,
    description: 'An array of nested Lego boxes',
    type: [NestedLegoBoxDto],
  })
  @Get(':boxId/nested-boxes')
  async findNestedBoxes(
    @Param('boxId') boxId: number,
  ): Promise<NestedLegoBoxDto[]> {
    return this.nestedLegoBoxesService.findAllByParentBoxId(boxId);
  }

  @ApiOperation({ summary: 'Add a nested Lego box to a Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the parent Lego box' })
  @ApiResponse({
    status: 201,
    description: 'The nested Lego box has been successfully added.',
    type: NestedLegoBoxDto,
  })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Post(':boxId/nested-boxes')
  async addNestedBox(
    @Param('boxId') boxId: number,
    @Body() createNestedLegoBoxDto: CreateNestedLegoBoxDto,
  ): Promise<NestedLegoBoxDto> {
    return this.nestedLegoBoxesService.create(createNestedLegoBoxDto);
  }

  @ApiOperation({ summary: 'Update the amount of a nested Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the parent Lego box' })
  @ApiParam({
    name: 'relationId',
    description: 'ID of the nested Lego box relation',
  })
  @ApiResponse({
    status: 200,
    description: 'The nested Lego box amount has been successfully updated',
    type: NestedLegoBoxDto,
  })
  @ApiResponse({ status: 404, description: 'Nested Lego Box not found' })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Patch(':boxId/nested-boxes/:relationId')
  async updateNestedBoxAmount(
    @Param('boxId') boxId: number,
    @Param('relationId') relationId: number,
    @Body() updateNestedLegoBoxDto: UpdateNestedLegoBoxDto,
  ): Promise<NestedLegoBoxDto> {
    return this.nestedLegoBoxesService.update(
      relationId,
      updateNestedLegoBoxDto,
    );
  }

  @ApiOperation({ summary: 'Remove a nested Lego box from a Lego box' })
  @ApiParam({ name: 'boxId', description: 'ID of the parent Lego box' })
  @ApiParam({
    name: 'relationId',
    description: 'ID of the nested Lego box relation',
  })
  @ApiResponse({
    status: 200,
    description: 'The nested Lego box has been successfully removed.',
  })
  @ApiResponse({ status: 404, description: 'Nested Lego Box not found' })
  @ApiValidationErrorResponse()
  @ApiInternalServerErrorResponse()
  @Delete(':boxId/nested-boxes/:relationId')
  async removeNestedBox(
    @Param('boxId') boxId: number,
    @Param('relationId') relationId: number,
  ): Promise<void> {
    return this.nestedLegoBoxesService.delete(relationId);
  }
}
