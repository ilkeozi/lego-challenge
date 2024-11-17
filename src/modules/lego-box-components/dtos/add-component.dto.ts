import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { ComponentDto } from './component.dto';
import { Type } from 'class-transformer';

export class AddComponentsDto {
  @ApiProperty({ description: 'ID of the parent Lego Box', example: 'uuid-1' })
  @IsString()
  parent_item_id: string;

  @ApiProperty({
    description: 'List of components to add',
    type: [ComponentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentDto)
  components: ComponentDto[];
}
