import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateLegoBoxPieceDto {
  @ApiProperty({ description: 'ID of the Lego box', example: 1 })
  @IsNumber()
  boxId: number;

  @ApiProperty({ description: 'ID of the Lego piece', example: 1 })
  @IsNumber()
  pieceId: number;

  @ApiProperty({ description: 'Quantity of the Lego piece', example: 5 })
  @IsNumber()
  @IsPositive()
  amount: number;
}
