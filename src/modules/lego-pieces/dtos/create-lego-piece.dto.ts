import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateLegoPieceDto {
  @ApiProperty({
    description: 'Name of the Lego piece',
    example: 'Rectangle Brick',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Price of the Lego piece',
    example: 10.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
}
