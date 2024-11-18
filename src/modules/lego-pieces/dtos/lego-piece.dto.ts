import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class LegoPieceDto {
  @ApiProperty({
    description: 'Unique identifier for the Lego piece',
    example: 5,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the Lego piece',
    example: 'Rectangle Brick',
  })
  name: string;

  @ApiProperty({
    description: 'Price of the Lego piece',
    example: 10.5,
  })
  price: number;

  @Exclude() // Excluded during transformation
  version?: number;
}
