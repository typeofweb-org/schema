import { typeToPrint } from '../stringify';
import type { Schema } from '../types';
import { right } from '../utils/either';

export const unknown = () => {
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
