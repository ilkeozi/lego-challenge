import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTransactionBoxDto {
  @ApiProperty({ description: 'ID of the Lego box being imported', example: 1 })
  @IsNumber()
  box_id: number;

  @ApiProperty({ description: 'Amount to be imported', example: 100 })
  @IsNumber()
  amount: number;
}
