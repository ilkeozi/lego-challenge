import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  VersionColumn,
} from 'typeorm';

@Entity('lego_boxes')
@Index('idx_lego_boxes_version', ['version']) // Index for Optimistic Locking
export class LegoBox {
  @PrimaryGeneratedColumn('uuid')
  lego_box_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  direct_price: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  nested_price: number;

  @Column({ type: 'smallint', default: 1, nullable: false })
  @VersionColumn()
  version: number;
}
