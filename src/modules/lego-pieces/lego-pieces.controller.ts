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
import { LegoPiecesService } from './lego-pieces.service';
import { CreateLegoPieceDto } from './dtos/create-lego-piece.dto';
import { LegoPieceDto } from './dtos/lego-piece.dto';
import { UpdateLegoPieceDto } from './dtos/update-lego-piece.dto';

@ApiTags('Lego Pieces')
@Controller('lego-pieces')
export class LegoPiecesController {
  constructor(private readonly legoPiecesService: LegoPiecesService) {}

  @ApiOperation({ summary: 'Create a new Lego piece' })
  @ApiResponse({
    status: 201,
    description: 'The Lego piece has been successfully created.',
    type: LegoPieceDto,
  })
  @Post()
  async create(
    @Body() createLegoPieceDto: CreateLegoPieceDto,
  ): Promise<LegoPieceDto> {
    return this.legoPiecesService.create(createLegoPieceDto);
  }

  @ApiOperation({ summary: 'Retrieve all Lego pieces' })
  @ApiResponse({
    status: 200,
    description: 'An array of Lego pieces',
    type: [LegoPieceDto],
  })
  @Get()
  async findAll(): Promise<LegoPieceDto[]> {
    return this.legoPiecesService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a Lego piece by ID' })
  @ApiParam({ name: 'id', description: 'ID of the Lego piece' })
  @ApiResponse({
    status: 200,
    description: 'The requested Lego piece',
    type: LegoPieceDto,
  })
  @ApiResponse({ status: 404, description: 'Lego piece not found' })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LegoPieceDto> {
    return this.legoPiecesService.findById(id);
  }

  @ApiOperation({ summary: 'Update an existing Lego piece' })
  @ApiParam({ name: 'id', description: 'ID of the Lego piece to update' })
  @ApiResponse({
    status: 200,
    description: 'The updated Lego piece',
    type: LegoPieceDto,
  })
  @ApiResponse({ status: 404, description: 'Lego piece not found' })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLegoPieceDto: UpdateLegoPieceDto,
  ): Promise<LegoPieceDto> {
    return this.legoPiecesService.update(id, updateLegoPieceDto);
  }

  @ApiOperation({ summary: 'Delete a Lego piece' })
  @ApiParam({ name: 'id', description: 'ID of the Lego piece to delete' })
  @ApiResponse({ status: 200, description: 'The Lego piece has been deleted.' })
  @ApiResponse({ status: 404, description: 'Lego piece not found' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.legoPiecesService.delete(id);
  }
}
