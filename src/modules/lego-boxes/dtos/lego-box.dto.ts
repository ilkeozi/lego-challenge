import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { LegoBoxPiece } from 'src/infrastructure/database/entities/lego-box-piece.entity';
import { NestedLegoBox } from 'src/infrastructure/database/entities/nested-lego-box.entity';

export class LegoBoxDto {
  @ApiProperty({
    description: 'Unique identifier for the Lego box',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the Lego box',
    example: 'City Building Set',
  })
  name: string;

  @ApiProperty({
    description: 'Total price of the Lego box',
    example: 150.25,
  })
  totalPrice?: number;

  @Exclude()
  pieces?: LegoBoxPiece[];

  @Exclude()
  childBoxes?: NestedLegoBox[];
}
