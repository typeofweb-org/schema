import { ValidationError } from '../errors';

import type { SomeSchema, TypeOf } from '../types';

export const validate =
  <S extends SomeSchema<unknown>>(schema: S) =>
  (value: unknown) => {
    const result = schema.__validate(value);

    if (result._t === 'right' || result._t === 'nextValid') {
      return result.value as TypeOf<S>;
    } else {
      throw new ValidationError(schema, value, result);
    }
  };
