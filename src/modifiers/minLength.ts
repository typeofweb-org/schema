import { ValidationError } from '../errors';
import type { SomeSchema, Schema, TupleOf, MergeModifiers } from '../types';
import { left } from '../utils/either';

export const minLength = <L extends number>(length: L) => <
  S extends SomeSchema<string> | SomeSchema<readonly unknown[]>
>(
  schema: S,
) => {
  return {
    ...(schema as SomeSchema<string> | SomeSchema<readonly unknown[]>),
    __validate(value) {
      if ((typeof value !== 'string' && !Array.isArray(value)) || value.length < length) {
        return left(new ValidationError(this, value));
      }
      return schema.__validate(value);
    },
    __modifiers: {
      ...schema.__modifiers,
      minLength: length,
    },
  } as Schema<
    S['__type'] extends readonly unknown[]
      ? readonly [...TupleOf<S['__type'][number], L>, ...S['__type']]
      : S['__type'],
    MergeModifiers<
      S['__modifiers'],
      {
        readonly minLength: L;
      }
    >,
    S['__values']
  >;
};
