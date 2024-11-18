import { Controller, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LegoBoxesService } from '../lego-boxes/lego-boxes.service';
import { LegoBoxPiecesService } from '../lego-box-pieces/lego-box-pieces.service';
import { NestedLegoBoxesService } from '../nested-lego-boxes/nested-lego-boxes.service';
import { CreateLegoBoxDto } from '../lego-boxes/dtos/create-lego-box.dto';
import { AddComponentsDto } from './dtos/add-component.dto';
import { CreateTransactionBoxDto } from './dtos/create-transaction-box.dto';

@ApiTags('Lego Challenge')
@Controller('lego-challenge')
export class LegoChallengeController {
  constructor(
    private readonly legoBoxesService: LegoBoxesService,
    private readonly legoBoxPiecesService: LegoBoxPiecesService,
    private readonly nestedLegoBoxesService: NestedLegoBoxesService,
  ) {}

  @ApiOperation({ summary: 'Create a new Lego Box' })
  @ApiResponse({
    status: 201,
    description: 'Lego box successfully created',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('create-box')
  async createBox(@Body() createLegoBoxDto: CreateLegoBoxDto): Promise<void> {
    await this.legoBoxesService.create(createLegoBoxDto);
  }

  @ApiOperation({
    summary: 'Add components to a Lego box with update propagation',
  })
  @ApiResponse({
    status: 201,
    description: 'Components successfully added to the Lego box',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('add-components')
  async addComponents(
    @Body() addComponentsDto: AddComponentsDto,
  ): Promise<void> {
    const { parent_item_id, components } = addComponentsDto;

    for (const component of components) {
      if (component.component_type === 'piece') {
        await this.legoBoxPiecesService.create({
          boxId: parent_item_id,
          pieceId: component.component_id,
          amount: component.amount,
        });
      } else if (component.component_type === 'set') {
        await this.nestedLegoBoxesService.create({
          parentBoxId: parent_item_id,
          childBoxId: component.component_id,
          amount: component.amount,
        });
      }
    }
  }

  @ApiOperation({
    summary: 'Import a Lego box into a parent Lego box with automated pricing',
  })
  @ApiParam({ name: 'parentBoxId', description: 'ID of the parent Lego box' })
  @ApiResponse({
    status: 201,
    description: 'Transaction box successfully created',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post(':parentBoxId/import-box')
  async importBox(
    @Param('parentBoxId') parentBoxId: number,
    @Body() createTransactionBoxDto: CreateTransactionBoxDto,
  ): Promise<void> {
    const { box_id, amount } = createTransactionBoxDto;

    // Validate the parent box exists
    const parentBox = await this.legoBoxesService.findById(parentBoxId);

    // Validate the box being imported exists
    const importedBox = await this.legoBoxesService.findById(box_id);

    // Add the imported box as a nested Lego box in the parent
    await this.nestedLegoBoxesService.create({
      parentBoxId: parentBox.id,
      childBoxId: importedBox.id,
      amount,
    });

    // Recalculate pricing for the parent box
    //await this.legoBoxesService.recalculatePricing(parentBoxId);
  }
}
