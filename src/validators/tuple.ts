/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { initialModifiers, isSchema } from '../schema';
import { schemaToString } from '../stringify';
import type { SomeSchema, TypeOf, Schema, Primitives } from '../types';
import { left, right } from '../utils/either';

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
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, values: readonly unknown[]) {
  if (!Array.isArray(values) || values.length !== this.__values.length) {
    return left(new ValidationError(this, values));
  }

  let isError = false;
  const result = new Array(values.length);
  for (let i = 0; i < values.length; ++i) {
    const valueOrSchema = this.__values[i];
    const value = values[i] as unknown;

    if (isSchema(valueOrSchema)) {
      const r = valueOrSchema.__validate(value);
      result[i] = r.value as unknown;
      isError ||= r._t === 'left';
      continue;
    } else {
      if (valueOrSchema === value) {
        result[i] = value;
        continue;
      } else {
        result[i] = new ValidationError(this, values);
        isError = true;
        continue;
      }
    }
  }

  if (isError) {
    return left(result);
  }
  return right(result);
}
