import { ValidationError } from '../errors';
import type { SomeSchema, TypeOf } from '../types';

export const validate = <S extends SomeSchema<unknown>>(schema: S) => (value: unknown) => {
  const parsedValue: unknown = schema.__parse ? schema.__parse(value) : value;
  const result = schema.__validate(parsedValue);

  if (result._t === 'right' || result._t === 'next') {
    return result.value as TypeOf<S>;
  } else {
    // throw result.value;
    throw new ValidationError(schema, value);
  }
};
