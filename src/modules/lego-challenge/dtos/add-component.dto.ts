import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ComponentDto } from './component.dto';

export class AddComponentsDto {
  @ApiProperty({ description: 'ID of the parent Lego Box', example: 5 })
  @IsNumber()
  parent_item_id: number;

  @ApiProperty({
    description: 'List of components to add',
    type: [ComponentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentDto)
  components: ComponentDto[];
}
