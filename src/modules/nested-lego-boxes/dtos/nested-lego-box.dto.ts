import { ApiProperty } from '@nestjs/swagger';

export class NestedLegoBoxDto {
  @ApiProperty({
    description: 'ID of the nested Lego box relation',
    example: 1,
  })
  id: number;

  @ApiProperty({ description: 'ID of the parent Lego box', example: 1 })
  parentBoxId: number;

  @ApiProperty({ description: 'ID of the child Lego box', example: 2 })
  childBoxId: number;

  @ApiProperty({ description: 'Amount of the child Lego box', example: 5 })
  amount: number;
}
