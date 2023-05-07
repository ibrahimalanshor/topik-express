import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationSchemaError } from '../errors/validation-schema-error';

type ObjectTransfromer<T> = (obj: Record<string, any>) => Promise<T>;

async function transformAndValidate<T extends object>(
  classConstructor: ClassConstructor<T>,
  obj: Record<string, any>
): Promise<T> {
  try {
    const transformedObj = plainToClass(classConstructor, obj, {
      excludeExtraneousValues: true,
    });

    await validateOrReject(transformedObj);

    return transformedObj;
  } catch (err) {
    if (Array.isArray(err)) {
      throw new ValidationSchemaError(err as ValidationError[]);
    }

    throw err;
  }
}

export function createObjectTransformerWithValidator<T extends object>(
  classConstructor: ClassConstructor<T>
): ObjectTransfromer<T> {
  return async (obj: Record<string, any>) =>
    await transformAndValidate(classConstructor, obj);
}
