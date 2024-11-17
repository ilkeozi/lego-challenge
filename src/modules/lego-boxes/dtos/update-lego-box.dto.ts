import { PartialType } from '@nestjs/swagger';
import { CreateLegoBoxDto } from './create-lego-box.dto';

export class UpdateLegoBoxDto extends PartialType(CreateLegoBoxDto) {}
