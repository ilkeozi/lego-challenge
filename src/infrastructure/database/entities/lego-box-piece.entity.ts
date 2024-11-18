import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { LegoBox } from './lego-box.entity';
import { LegoPiece } from './lego-piece.entity';

@Entity('lego_box_pieces')
@Check('amount > 0')
export class LegoBoxPiece {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LegoBox, (legoBox) => legoBox.pieces, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'box_id' })
  @Index()
  box: LegoBox;

  @ManyToOne(() => LegoPiece, { eager: true })
  @JoinColumn({ name: 'piece_id' })
  @Index()
  piece: LegoPiece;

  @Column()
  amount: number;
}
