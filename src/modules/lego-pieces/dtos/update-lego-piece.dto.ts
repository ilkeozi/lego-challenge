import { PartialType } from '@nestjs/swagger';
import { CreateLegoPieceDto } from './create-lego-piece.dto';

export class UpdateLegoPieceDto extends PartialType(CreateLegoPieceDto) {}
