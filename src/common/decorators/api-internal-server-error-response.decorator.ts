import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * A decorator to handle 500 Internal Server Error responses globally.
 */
export function ApiInternalServerErrorResponse(
  description = 'Internal server error',
) {
  return applyDecorators(
    ApiResponse({
      status: 500,
      description,
    }),
  );
}
