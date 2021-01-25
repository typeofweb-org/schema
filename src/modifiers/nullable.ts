import type { SomeSchema, Schema, MergeModifiers } from '../types';
import { right } from '../utils/either';

export const nullable = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      nullable: true,
    },
    __validate(value) {
      if (value === null) {
        return right(value);
      }
      return schema.__validate(value);
    },
  } as Schema<
    S['__type'],
    MergeModifiers<S['__modifiers'], { readonly nullable: true }>,
    S['__values']
  >;
};
