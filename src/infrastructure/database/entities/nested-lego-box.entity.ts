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

@Entity('nested_lego_boxes')
@Check('amount > 0')
export class NestedLegoBox {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LegoBox, (legoBox) => legoBox.childBoxes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_box_id' })
  @Index()
  parentBox: LegoBox;

  @ManyToOne(() => LegoBox, { eager: true })
  @JoinColumn({ name: 'child_box_id' })
  @Index()
  childBox: LegoBox;

  @Column()
  amount: number;
}
