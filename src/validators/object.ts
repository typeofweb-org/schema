import { ValidationError } from '../errors';
import { isOptionalSchema } from '../modifiers/optional';
import { initialModifiers } from '../schema';
import { schemaToString, objectToPrint, quote } from '../stringify';
import type { Schema, SomeSchema, TypeOf, UndefinedToOptional } from '../types';
import { __mapEither } from '../utils/mapEither';

import { __validate } from './__validate';

export const object = <U extends Record<string, SomeSchema<any>>>(obj: U) => {
  type TypeOfResult = UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >;

  return {
    __modifiers: initialModifiers,
    __type: {} as TypeOfResult,
    __values: obj,
    toString: toStringObject,
    __validate: validateObject,
  } as Schema<TypeOfResult, typeof initialModifiers, U>;
};

function toStringObject<
  U extends Record<string, SomeSchema<any>>,
  TypeOfResult = UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >
>(this: Schema<TypeOfResult, typeof initialModifiers, U>) {
  const entries = Object.entries(this.__values).map(
    ([key, val]) => [key, schemaToString(val)] as const,
  );
  if (entries.length === 0) {
    return objectToPrint('');
  }
  return objectToPrint(' ' + entries.map(([key, val]) => quote(key) + ': ' + val).join(', ') + ' ');
}

function validateObject<
  U extends Record<string, SomeSchema<any>>,
  TypeOfResult extends UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, value: Record<string, unknown>) {
  if (typeof value !== 'object' || value === null) {
    return { _t: 'left', value: new ValidationError(this, value) };
  }
  const validators = this.__values as Record<string, SomeSchema<any>>;

  const valueKeys = Object.keys(value);
  const unknownKeysCount = valueKeys.filter((k) => !(k in validators)).length;

  if (!this.__modifiers.allowUnknownKeys && unknownKeysCount > 0) {
    return { _t: 'left', value: new ValidationError(this, value) };
  }

  const validatorEntries = Object.entries(validators);
  const allValidatorKeysCount = validatorEntries.length;
  const requiredValidatorKeysCount = validatorEntries.reduce(
    (acc, [_, schema]) => acc + (isOptionalSchema(schema) ? 0 : 1),
    0,
  );

  const isTooManyValues = this.__modifiers.allowUnknownKeys
    ? false
    : valueKeys.length > allValidatorKeysCount;

  if (isTooManyValues || valueKeys.length - unknownKeysCount < requiredValidatorKeysCount) {
    return { _t: 'left', value: new ValidationError(this, value) };
  }

  return __mapEither<Record<string, SomeSchema<any>>, TypeOfResult>((validator, key) => {
    const valueForValidator = value[key];
    return __validate(validator, valueForValidator) as Exclude<
      TypeOfResult[keyof TypeOfResult],
      undefined
    >;
  }, validators);
}
