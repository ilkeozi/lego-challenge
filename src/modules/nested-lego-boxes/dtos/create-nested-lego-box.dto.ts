import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateNestedLegoBoxDto {
  @ApiProperty({ description: 'ID of the parent Lego box', example: 1 })
  @IsNumber()
  parentBoxId: number;

  @ApiProperty({ description: 'ID of the child Lego box', example: 2 })
  @IsNumber()
  childBoxId: number;

  @ApiProperty({ description: 'Amount of the child Lego box', example: 5 })
  @IsNumber()
  amount: number;
}
