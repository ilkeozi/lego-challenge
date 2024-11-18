import { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (data === null || data === undefined) {
      return 0; // Use 0 instead of null
    }
    return data;
  }

  from(data?: string | null): number | null {
    if (data === null || data === undefined) {
      return 0; // Use 0 instead of null
    }
    const res = parseFloat(data);
    return isNaN(res) ? 0 : res; // Return 0 for invalid values
  }
}
