import type { MergeModifiers, Schema, SomeSchema } from '../types';
import { right } from '../utils/either';

export const optional = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
    },
    __validate(value) {
      if (value === undefined) {
        return right(value);
      }
      return schema.__validate(value);
    },
  } as Schema<
    S['__type'],
    MergeModifiers<S['__modifiers'], { readonly optional: true }>,
    S['__values']
  >;
};
