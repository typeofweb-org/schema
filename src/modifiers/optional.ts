import type { Schema, SomeSchema } from '../types';
import { right } from '../utils/either';

export const optional = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __validate(value) {
      if (value === undefined) {
        return right(value);
      }
      return schema.__validate(value);
    },
  } as Schema<S['__type'], S['__values']>;
};
