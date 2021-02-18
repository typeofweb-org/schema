/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { isSchema } from '../schema';
import { schemaToString } from '../stringify';
import type { Primitives, Schema, SomeSchema, TypeOf } from '../types';
import { left, right } from '../utils/either';

// `U extends (Primitives)[]` and `[...U]` is a trick to force TypeScript to narrow the type correctly
// thanks to this, there's no need for "as const": oneOf(['a', 'b']) works as oneOf(['a', 'b'] as const)
export const oneOf = <U extends readonly (Primitives | SomeSchema<any>)[]>(
  values: readonly [...U],
) => <S extends SomeSchema<any>>(schema?: S) => {
  type TypeOfResult = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number];

  return {
    __values: values,
    __type: {} as unknown,

    toString: toStringOneOf,
    __validate: validateOneOf,
  } as Schema<TypeOfResult, U>;
};

function toStringOneOf<
  U extends readonly (Primitives | SomeSchema<any>)[],
  TypeOfResult extends {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number]
>(this: Schema<TypeOfResult, U>, _value: unknown) {
  const str = this.__values
    .map((s) => (isSchema(s) ? schemaToString(s) : JSON.stringify(s)))
    .join(' | ');

  return this.__values.length > 1 ? `(${str})` : str;
}

function validateOneOf<
  U extends readonly (Primitives | SomeSchema<any>)[],
  TypeOfResult extends {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number]
>(this: Schema<TypeOfResult, U>, value: unknown) {
  for (let i = 0; i < this.__values.length; ++i) {
    const valueOrSchema = this.__values[i];
    if (isSchema(valueOrSchema)) {
      const r = valueOrSchema.__validate(value);
      if (r._t === 'right') {
        return r;
      }
      continue;
    } else {
      if (value === valueOrSchema) {
        return right(valueOrSchema as TypeOfResult);
      }
    }
  }
  return left(new ValidationError(this, value));
}
