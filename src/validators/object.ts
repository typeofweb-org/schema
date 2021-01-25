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
  const allowUnknownKeys = !!this.__modifiers.allowUnknownKeys;

  let isError = false;
  const result = {} as Record<string, unknown>;
  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) {
      continue;
    }
    const value = object[key];

    const validator = validators[key];
    if (validator) {
      const r = validator.__validate(value);
      result[key] = r.value;
      isError ||= r._t === 'left';
      continue;
    } else {
      if (allowUnknownKeys) {
        result[key] = value;
        continue;
      } else {
        isError = true;
        result[key] = new ValidationError(this, object);
        continue;
      }
    }
  }

  for (const key in validators) {
    if (!Object.prototype.hasOwnProperty.call(validators, key)) {
      continue;
    }
    if (key in result) {
      continue;
    }
    const validator = validators[key]!;
    const value = object[key];
    const r = validator.__validate(value);
    result[key] = r.value;
    isError ||= r._t === 'left';
  }

  if (isError) {
    return left(result);
  }
  return right(result);
}
