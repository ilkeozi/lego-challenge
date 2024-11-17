import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateLegoBoxDto {
  @ApiProperty({
    description: 'Name of the Lego box',
    example: 'Classic Bricks Set',
  })
  @IsString()
  name: string;

  @Exclude()
  direct_price?: number;
}
