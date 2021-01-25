/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { schemaToString, typeToPrint } from '../stringify';
import type { Schema, SomeSchema, TypeOf } from '../types';
import { left, right } from '../utils/either';

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
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, values: readonly unknown[]) {
  if (!Array.isArray(values)) {
    return left(new ValidationError(this, values));
  }

  const validators = this.__values;

  let isError = false;
  const result = new Array(values.length);
  valuesLoop: for (let i = 0; i < values.length; ++i) {
    const value = values[i]! as unknown;
    for (let k = 0; k < validators.length; ++k) {
      const validator = validators[k]!;
      const r = validator.__validate(value);
      if (r._t === 'right') {
        result[i] = r.value;
        continue valuesLoop;
      }
    }
    result[i] = new ValidationError(this, values);
    isError = true;
    continue;
  }

  if (isError) {
    return left(result);
  }
  return right(result);
}
