import { typeToPrint } from '../stringify';
import type { Schema, SomeSchema } from '../types';
import { right } from '../utils/either';

export const unknown = <S extends SomeSchema<any>>(schema?: S) => {
  return {
    toString: toStringUnknown,
    __validate: validateUnknown,
  } as Schema<unknown, never>;
};

function toStringUnknown() {
  return typeToPrint('unknown');
}
function validateUnknown(this: Schema<unknown, never>, value: unknown) {
  return right(value);
}
