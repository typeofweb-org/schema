/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { refine } from '../refine';
import { schemaToString, typeToPrint } from '../stringify';
import type { Schema, SomeSchema, TypeOf } from '../types';

export const array = <U extends readonly SomeSchema<unknown>[]>(...validators: readonly [...U]) => <
  S extends SomeSchema<any>
>(
  schema?: S,
) => {
  type TypeOfResult = readonly TypeOf<U[number]>[];

  const validateArray = refine(function (this: SomeSchema<any>, values, t) {
    if (!Array.isArray(values)) {
      return t.left(values);
    }

    let isError = false;
    const result = new Array(values.length);
    valuesLoop: for (let i = 0; i < values.length; ++i) {
      const value = values[i]! as unknown;
      for (let k = 0; k < validators.length; ++k) {
        const validator = validators[k]!;
        const r = validator.__validate(value);
        if (r._t === 'right' || r._t === 'next') {
          result[i] = r.value;
          continue valuesLoop;
        }
      }
      result[i] = new ValidationError(this, values);
      isError = true;
      continue;
    }

    if (isError) {
      return t.left(result);
    }
    return t.next(result);
  });

  return {
    __type: {} as TypeOfResult,
    __values: validators,
    toString: toStringArray,
    __validate: validateArray(schema).__validate,
  } as Schema<TypeOfResult, typeof validators>;
};

function toStringArray<
  U extends readonly SomeSchema<unknown>[],
  TypeOfResult extends readonly TypeOf<U[number]>[]
>(this: Schema<TypeOfResult, U>) {
  const str = this.__values.map((s) => schemaToString(s)).join(' | ');
  return this.__values.length > 1 ? typeToPrint(`(${str})[]`) : typeToPrint(`${str}[]`);
}
