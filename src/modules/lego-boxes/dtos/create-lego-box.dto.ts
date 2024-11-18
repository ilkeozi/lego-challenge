import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLegoBoxDto {
  @ApiProperty({
    description: 'Name of the Lego box',
    example: 'Classic Bricks Set',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Exclude()
  totalPrice?: number;
}
