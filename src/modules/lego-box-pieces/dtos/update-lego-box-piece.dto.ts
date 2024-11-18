import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateLegoBoxPieceDto {
  @ApiProperty({
    description: 'Updated amount of the Lego piece in the box.',
    example: 5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
