import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ValidationError } from '../dtos/validation-error.dto';

export const ApiValidationErrorResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Validation failed',
      type: ValidationError,
    }),
  );
