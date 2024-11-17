import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LegoBoxComponent } from '../entities/lego-box-component.entity';

@Injectable()
export class LegoBoxComponentRepository extends Repository<LegoBoxComponent> {
  constructor(private dataSource: DataSource) {
    super(LegoBoxComponent, dataSource.createEntityManager());
  }

  async validateStagingComponents(): Promise<string[]> {
    const invalidComponents = await this.query(`
      SELECT linked_component_id
      FROM temp_lego_box_components
      LEFT JOIN lego_pieces lp ON temp_lego_box_components.linked_component_id = lp.lego_piece_id
      LEFT JOIN lego_boxes ls ON temp_lego_box_components.linked_component_id = ls.lego_box_id
      WHERE lp.lego_piece_id IS NULL AND ls.lego_box_id IS NULL;
    `);
    return invalidComponents.map((component) => component.linked_component_id);
  }

  async commitStagingComponents(): Promise<void> {
    await this.query(`
      INSERT INTO lego_box_components (lego_box_id, linked_component_id, component_type, quantity, status)
      SELECT lego_box_id, linked_component_id, component_type, quantity, 'completed'
      FROM temp_lego_box_components
      WHERE status = 'pending';
    `);
  }
}
