import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { schemaToString, typeToPrint } from '../stringify';
import type { Schema, SomeSchema, TypeOf } from '../types';
import { __mapEither } from '../utils/mapEither';

export const array = <U extends readonly SomeSchema<unknown>[]>(...arr: readonly [...U]) => {
  type TypeOfResult = readonly TypeOf<U[number]>[];
  return {
    __modifiers: initialModifiers,
    __type: {} as TypeOfResult,
    __values: arr,
    toString: toStringArray,
    __validate: validateArray,
  } as Schema<TypeOfResult, typeof initialModifiers, U>;
};

function toStringArray<
  U extends readonly SomeSchema<unknown>[],
  TypeOfResult extends readonly TypeOf<U[number]>[]
>(this: Schema<TypeOfResult, typeof initialModifiers, U>) {
  const str = this.__values.map((s) => schemaToString(s)).join(' | ');
  return this.__values.length > 1 ? typeToPrint(`(${str})[]`) : typeToPrint(`${str}[]`);
}

function validateArray<
  U extends readonly SomeSchema<unknown>[],
  TypeOfResult extends readonly TypeOf<U[number]>[]
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, value: unknown) {
  if (!Array.isArray(value)) {
    return { _t: 'left', value: new ValidationError(this, value) };
  }

  return __mapEither<readonly unknown[], readonly unknown[]>((val) => {
    const isValid = this.__values.some((validator) => validator.__validate(val)._t === 'right');
    return isValid
      ? { _t: 'right', value: val }
      : { _t: 'left', value: new ValidationError(this, value) };
  }, value);
}
