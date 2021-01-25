/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { schemaToString, objectToPrint, quote } from '../stringify';
import type { Schema, SomeSchema, TypeOf, UndefinedToOptional } from '../types';
import { left, right } from '../utils/either';

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
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, object: Record<string, unknown>) {
  if (typeof object !== 'object' || object === null) {
    return left(new ValidationError(this, object));
  }
  const validators = this.__values as Record<string, SomeSchema<any>>;
  const valueKeys = Object.keys(object);
  const validatorsKeys = Object.keys(validators);

  const keysToIterate = [...new Set([...valueKeys, ...validatorsKeys])];

  const entries = new Array<readonly [string, any]>(keysToIterate.length);
  let failed = false;
  for (let i = 0; i < keysToIterate.length; ++i) {
    const key = keysToIterate[i]!;
    const value = object[key];
    const validator = validators[key];

    if (!validator) {
      if (this.__modifiers.allowUnknownKeys) {
        entries[i] = [key, value];
        continue;
      }
      failed = true;
      entries[i] = [key, new ValidationError(this, value)];
      continue;
    }
    const validationResult = validator.__validate(object[key]);
    failed ||= validationResult._t === 'left';
    entries[i] = [key, validationResult.value];
    continue;
  }

  if (failed) {
    return left(Object.fromEntries(entries));
  }
  return right(Object.fromEntries(entries));
}
