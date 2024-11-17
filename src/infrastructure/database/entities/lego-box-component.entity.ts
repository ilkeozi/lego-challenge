import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Index,
} from 'typeorm';
import { LegoBox } from './lego-box.entity';

@Entity('lego_box_components')
@Index('idx_lego_box_components_lego_box_id', ['lego_box_id']) // For Lookups by lego_box_id
@Index('idx_lego_box_components_linked_component_id', ['linked_component_id']) // For Lookups by linked_component_id
export class LegoBoxComponent {
  @PrimaryGeneratedColumn('uuid')
  lego_box_component_id: string;

  @ManyToOne(() => LegoBox, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lego_box_id' })
  LegoBox: LegoBox;

  @Column({ type: 'uuid', nullable: false })
  lego_box_id: string;

  @Column({ type: 'uuid', nullable: false })
  linked_component_id: string;

  @Column({
    type: 'smallint',
    nullable: false,
    comment: '0 = piece, 1 = set',
    default: 0,
  })
  component_type: number;

  @Column({ type: 'smallint', nullable: false, default: 1 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    nullable: false,
  })
  status: 'pending' | 'completed' | 'failed';
}
