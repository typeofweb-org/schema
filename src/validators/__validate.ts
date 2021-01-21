import type { SomeSchema, TypeOf } from '..';
import type { Either } from '../types';

export const __validate = <S extends SomeSchema<any>>(
  schema: S,
  value: unknown,
): Either<TypeOf<S>> => {
  if (!schema.__validate) {
    throw new Error(`Not implemented: V2 ${schema.__validator.toString()}`);
  }

  return schema.__validate(schema, value);
};
