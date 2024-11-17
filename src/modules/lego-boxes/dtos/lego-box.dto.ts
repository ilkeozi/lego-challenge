import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class LegoBoxDto {
  @ApiProperty({
    description: 'Unique identifier for the Lego box',
    example: 'uuid-1',
  })
  lego_box_id: string;

  @ApiProperty({
    description: 'Name of the Lego box',
    example: 'City Building Set',
  })
  name: string;

  @Exclude() // Excluded during transformation
  direct_price?: number;

  @Exclude() // Excluded during transformation
  nested_price?: number;

  @Exclude() // Excluded during transformation
  version?: number; // Excluded, no need for @ApiProperty
}
