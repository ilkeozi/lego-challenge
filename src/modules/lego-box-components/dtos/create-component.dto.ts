import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber } from 'class-validator';

export class CreateComponentDto {
  @ApiProperty({
    description: 'Type of the component (piece or set)',
    example: 'piece',
  })
  @IsEnum(['piece', 'set'])
  component_type: 'piece' | 'set';

  @ApiProperty({ description: 'ID of the component', example: 'uuid-1' })
  @IsString()
  component_id: string;

  @ApiProperty({ description: 'Quantity of the component', example: 2 })
  @IsNumber()
  amount: number;
}
