import { ValidationError } from '../errors';
import { initialModifiers, isSchema } from '../schema';
import { schemaToString } from '../stringify';
import type { SomeSchema, TypeOf, Schema, Primitives, Either } from '../types';
import { __mapEither } from '../utils/mapEither';

import { __validate } from './__validate';

export const tuple = <U extends readonly (Primitives | SomeSchema<any>)[]>(
  values: readonly [...U],
) => {
  type TypeOfResult = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  };

  return {
    __values: values,
    __type: {} as TypeOfResult,
    __modifiers: initialModifiers,
    toString: toStringTuple,
    __validate: validateTuple,
  } as Schema<TypeOfResult, typeof initialModifiers, U>;
};

function toStringTuple<
  U extends readonly (Primitives | SomeSchema<any>)[],
  TypeOfResult extends {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, _value: unknown) {
  return (
    '[' +
    this.__values.map((s) => (isSchema(s) ? schemaToString(s) : JSON.stringify(s))).join(', ') +
    ']'
  );
}

function validateTuple<
  U extends readonly (Primitives | SomeSchema<any>)[],
  TypeOfResult extends {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, value: unknown) {
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
    this.__values,
  );
}
