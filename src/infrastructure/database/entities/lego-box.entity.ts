import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LegoBoxPiece } from './lego-box-piece.entity';
import { NestedLegoBox } from './nested-lego-box.entity';
import { ColumnNumericTransformer } from 'src/common/transformers/column-numeric.transformer';

@Entity('lego_boxes')
export class LegoBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  totalPrice: number;

  @OneToMany(() => LegoBoxPiece, (legoBoxPiece) => legoBoxPiece.box)
  pieces: LegoBoxPiece[];

  @OneToMany(() => NestedLegoBox, (nestedLegoBox) => nestedLegoBox.parentBox)
  childBoxes: NestedLegoBox[];
}
