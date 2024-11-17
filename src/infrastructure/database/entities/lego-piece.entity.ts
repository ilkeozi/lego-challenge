import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  VersionColumn,
} from 'typeorm';

@Entity('lego_pieces')
@Index('idx_lego_pieces_version', ['version']) // Index for Optimistic Locking
export class LegoPiece {
  @PrimaryGeneratedColumn('uuid')
  lego_piece_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'smallint', default: 1, nullable: false })
  @VersionColumn()
  version: number;
}
