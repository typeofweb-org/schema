/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema, SomeSchema, TypeOf } from '../types';

import { __mapEither } from './__mapEither';
import { initialModifiers } from './__schema';
import { schemaToString } from './__stringify';
import { typeToPrint } from './__stringifyHelpers';

export const array = <U extends readonly SomeSchema<unknown>[]>(...arr: readonly [...U]) => {
  type TypeOfResult = readonly TypeOf<U[number]>[];
  return {
    __modifiers: initialModifiers,
    __type: {} as TypeOfResult,
    __values: arr,
    toString() {
      const str = this.__values.map((s) => schemaToString(s)).join(' | ');
      return this.__values.length > 1 ? typeToPrint(`(${str})[]`) : typeToPrint(`${str}[]`);
    },
    __validate(_schema, value) {
      if (!Array.isArray(value)) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }

      return __mapEither<readonly unknown[], readonly unknown[]>((val) => {
        const isValid = this.__values.some(
          (validator) => validator.__validate(validator, val)._t === 'right',
        );
        return isValid
          ? { _t: 'right', value: val }
          : { _t: 'left', value: new ValidationError(this, value) };
      }, value);
    },
  } as Schema<TypeOfResult, typeof initialModifiers, U>;
};
