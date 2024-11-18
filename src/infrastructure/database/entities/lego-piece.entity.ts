import { ColumnNumericTransformer } from 'src/common/transformers/column-numeric.transformer';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('lego_pieces')
export class LegoPiece {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  @Index()
  price: number;
}
