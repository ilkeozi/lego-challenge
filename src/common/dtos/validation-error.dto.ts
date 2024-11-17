import { ApiProperty } from '@nestjs/swagger';

export class ValidationError {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({
    example: [
      { field: 'name', constraints: { isString: 'name must be a string' } },
    ],
    type: 'array',
  })
  errors: Array<{ field: string; constraints: Record<string, string> }>;
}
