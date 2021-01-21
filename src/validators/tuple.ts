/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { SomeSchema, TypeOf, Schema, Primitives, Either } from '../types';

import { __mapEither } from './__mapEither';
import { TYPEOFWEB_SCHEMA, InitialModifiers, isSchema } from './__schema';
import { __validate } from './__validate';

export type TUPLE_VALIDATOR = typeof TUPLE_VALIDATOR;
export type TupleSchema = ReturnType<typeof tuple>;
export const TUPLE_VALIDATOR = Symbol('_tuple');
export const tuple = <U extends readonly (Primitives | SomeSchema<any>)[]>(
  values: readonly [...U],
) => {
  type TypeOfResult = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  };

  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: TUPLE_VALIDATOR,
    __values: values,
    __type: {} as unknown,
    __modifiers: InitialModifiers,
    toString() {
      return (
        '[' +
        this.__values.map((s) => (isSchema(s) ? s.toString() : JSON.stringify(s))).join(', ') +
        ']'
      );
    },
    __validate(_schema, value: unknown) {
      if (!Array.isArray(value) || value.length !== this.__values.length) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }

      const v = value as readonly (Primitives | SomeSchema<any>)[];

      return __mapEither<readonly (Primitives | SomeSchema<any>)[], TypeOfResult>(
        (valueOrSchema, key) => {
          const valueForValidator = v[key] as unknown;
          if (isSchema(valueOrSchema)) {
            return __validate(valueOrSchema, valueForValidator);
          } else {
            const isValid = valueForValidator === valueOrSchema;
            return (isValid
              ? { _t: 'right', value: valueOrSchema }
              : { _t: 'left', value: new ValidationError(this, value) }) as Either<
              TypeOfResult[keyof TypeOfResult]
            >;
          }
        },
        this.__values as readonly (Primitives | SomeSchema<any>)[],
      );
    },
  } as Schema<TypeOfResult, typeof InitialModifiers, U, TUPLE_VALIDATOR>;
};

export const isTupleSchema = (s: SomeSchema<any>): s is TupleSchema =>
  s.__validator === TUPLE_VALIDATOR;
