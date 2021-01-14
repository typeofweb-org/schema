/* eslint-disable functional/no-this-expression */

declare global {
  interface Array<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }

  interface ReadonlyArray<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }
}

import type { AnySchema, Json, Primitives, SomeSchema } from './types';
import { fromEntries, isDate } from './utils';
import type { SIMPLE_VALIDATOR } from './validators';
import {
  isSchema,
  LITERAL_VALIDATOR,
  BOOLEAN_VALIDATOR,
  DATE_VALIDATOR,
  NUMBER_VALIDATOR,
  STRING_VALIDATOR,
  SIMPLE_VALIDATORS,
} from './validators';

const ValidatorToString: Record<SIMPLE_VALIDATOR, string> = {
  [STRING_VALIDATOR]: '≫string≪',
  [NUMBER_VALIDATOR]: '≫number≪',
  [BOOLEAN_VALIDATOR]: '≫boolean≪',
  [DATE_VALIDATOR]: '≫Date≪',
};

const schemaToJSON = (schema: AnySchema | Primitives | Record<string, Primitives>): Json => {
  if (typeof schema !== 'object') {
    return '≫' + typeof schema + '≪';
  }

  if (!isSchema(schema)) {
    if (isDate(schema)) {
      return isNaN(schema as any) ? '≫Invalid Date≪' : schema.toISOString();
    }
    return schema;
  }

  if (SIMPLE_VALIDATORS.includes(schema.__validator)) {
    return ValidatorToString[schema.__validator];
  }
  if (schema.__validator === LITERAL_VALIDATOR) {
    return schema.__values.map(schemaToJSON);
  }
  if (Array.isArray(schema.__validator)) {
    return schema.__validator.map(schemaToJSON);
  }
  return fromEntries(
    Object.entries(schema.__validator).map(([key, val]) => [key, schemaToJSON(val)]),
  );
};
export class ValidationError extends Error {
  public readonly details: ErrorDetails;

  constructor(schema: SomeSchema<any>, value: any) {
    const expected = JSON.stringify(schemaToJSON(schema), null, 1)
      .replace(/≪"/g, '≪')
      .replace(/"≫/g, '≫');
    const got = JSON.stringify(schemaToJSON(value), null, 1)
      .replace(/≪"/g, '≪')
      .replace(/"≫/g, '≫');

    const d: ErrorDetails = {
      kind: 'TYPE_MISMATCH',
      got,
      expected,
    };
    super(`Invalid type! Expected ${d.expected} but got ${d.got}!`);

    this.details = d;
    this.name = 'ValidationError';
    Error.captureStackTrace(this);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

type ErrorDetails = {
  readonly kind: 'TYPE_MISMATCH';
  readonly expected: string;
  readonly got: string;
};
