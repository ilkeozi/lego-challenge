import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LegoBox } from '../entities/lego-box.entity';

@Injectable()
export class LegoBoxRepository extends Repository<LegoBox> {
  constructor(private dataSource: DataSource) {
    super(LegoBox, dataSource.createEntityManager());
  }

  async getTotalPrice(LegoBoxId: string): Promise<number> {
    const result = await this.createQueryBuilder('lego_boxes')
      .select('direct_price + nested_price', 'total_price')
      .where('lego_box_id = :LegoBoxId', { LegoBoxId })
      .getRawOne();
    return result?.total_price || 0;
  }

  async updateDirectPrice(LegoBoxId: string): Promise<void> {
    await this.query(
      `
      UPDATE lego_boxes
      SET direct_price = (
        SELECT SUM(lp.price * lsc.quantity)
        FROM lego_box_components lsc
        JOIN lego_pieces lp ON lsc.linked_component_id = lp.lego_piece_id
        WHERE lsc.lego_box_id = $1
      ), version = version + 1
      WHERE lego_box_id = $1;
    `,
      [LegoBoxId],
    );
  }

  async updateNestedPrice(LegoBoxId: string): Promise<void> {
    await this.query(
      `
      WITH RECURSIVE PriceUpdate AS (
        SELECT 
          lsc.lego_box_id AS set_id,
          SUM(lp.price * lsc.quantity) AS nested_price
        FROM lego_box_components lsc
        JOIN lego_pieces lp ON lsc.linked_component_id = lp.lego_piece_id
        WHERE lsc.component_type = 0
        GROUP BY lsc.lego_box_id
        UNION ALL
        SELECT 
          lsc.lego_box_id AS set_id,
          SUM(ls.nested_price * lsc.quantity) AS nested_price
        FROM lego_box_components lsc
        JOIN lego_boxes ls ON lsc.linked_component_id = ls.lego_box_id
        WHERE lsc.component_type = 1
        GROUP BY lsc.lego_box_id
      )
      UPDATE lego_boxes
      SET nested_price = (
        SELECT SUM(nested_price)
        FROM PriceUpdate
        WHERE PriceUpdate.set_id = lego_boxes.lego_box_id
      ), version = version + 1
      WHERE lego_box_id = $1;
    `,
      [LegoBoxId],
    );
  }

  async refreshMaterializedView(): Promise<void> {
    await this.query(`REFRESH MATERIALIZED VIEW lego_box_price_aggregation;`);
  }
}
