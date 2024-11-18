import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateNestedLegoBoxDto {
  @ApiProperty({ description: 'Amount of the child Lego box', example: 5 })
  @IsNumber()
  amount: number;
}
