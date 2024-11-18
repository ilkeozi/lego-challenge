import { ApiProperty } from '@nestjs/swagger';

export class LegoBoxPieceDto {
  @ApiProperty({ description: 'ID of the Lego box piece', example: 1 })
  id: number;

  @ApiProperty({
    description: 'ID of the Lego box this piece belongs to',
    example: 1,
  })
  boxId: number;

  @ApiProperty({ description: 'ID of the Lego piece', example: 1 })
  pieceId: number;

  @ApiProperty({ description: 'Quantity of the Lego piece', example: 5 })
  amount: number;
}
