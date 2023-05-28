import { ValidationError } from 'class-validator';

export class ValidationSchemaError {
  errors: Record<string, string>;

  constructor(errors: ValidationError[]) {
    this.mapError(errors);
  }

  mapError(errors: ValidationError[]) {
    this.errors = Object.fromEntries(
      errors.map((value: ValidationError) => {
        return [
          value.property,
          value.constraints ? Object.values(value.constraints)[0] : '',
        ];
      })
    );
  }
}
