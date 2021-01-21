/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema, SomeSchema, TypeOf } from '../types';

import { __mapEither } from './__mapEither';
import { TYPEOFWEB_SCHEMA, InitialModifiers, isSchema } from './__schema';
import { isSimpleSchema } from './__simpleValidators';
import { schemaToString } from './__stringify';
import { typeToPrint } from './__stringifyHelpers';

export type ArraySchema = ReturnType<typeof array>;
export const array = <U extends readonly SomeSchema<unknown>[]>(...arr: readonly [...U]) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: arr,
    __modifiers: InitialModifiers,
    __type: {} as unknown,
    __values: {} as unknown,
    toString() {
      const str = this.__validator
        .map((s) => (isSchema(s) && isSimpleSchema(s) ? s.toString(true) : schemaToString(s)))
        .join(' | ');

      return str.length > 1 ? typeToPrint(`(${str})[]`) : typeToPrint(`${str}[]`);
    },
    __validate(_schema, value) {
      if (!Array.isArray(value)) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      if (
        typeof this.__modifiers.minLength === 'number' &&
        value.length < this.__modifiers.minLength
      ) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }

      return __mapEither<readonly unknown[], readonly unknown[]>((val) => {
        const isValid = this.__validator.some(
          (validator) => validator.__validate!(validator, val)._t === 'right',
        );
        return isValid
          ? { _t: 'right', value: val }
          : { _t: 'left', value: new ValidationError(this, value) };
      }, value);
    },
  } as Schema<readonly TypeOf<U[number]>[], typeof InitialModifiers, never, U>;
};

export const isArraySchema = (s: SomeSchema<any>): s is ArraySchema => Array.isArray(s.__validator);
