/* eslint-disable functional/no-this-expression */

declare global {
  interface Array<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }

  interface ReadonlyArray<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }
}

import type { AnySchema, SomeSchema } from './types';
import type { SimpleValidators } from './validators';
import {
  isArraySchema,
  isLiteralSchema,
  isSimpleSchema,
  isSchema,
  BOOLEAN_VALIDATOR,
  DATE_VALIDATOR,
  NUMBER_VALIDATOR,
  STRING_VALIDATOR,
} from './validators';

const ValidatorToString: Record<SimpleValidators, string> = {
  [STRING_VALIDATOR]: 'string',
  [NUMBER_VALIDATOR]: 'number',
  [BOOLEAN_VALIDATOR]: 'boolean',
  [DATE_VALIDATOR]: 'Date',
};

const typeToPrint = (str: string) => '≫' + str + '≪';
const objectToPrint = (str: string) => '{' + str + '}';
const quote = (str: string) => (/\s/.test(str) ? `"${str}"` : str);
const arrayToPrint = (arr: readonly string[]): string => {
  const str = arr.join(' | ');

  if (arr.length > 1) {
    return typeToPrint(`(${str})[]`);
  }
  return typeToPrint(`${str}[]`);
};
const literalToPrint = (arr: readonly string[]): string => {
  const str = arr.join(' | ');

  if (arr.length > 1) {
    return `(${str})`;
  }
  return str;
};

const simpleValidatorToString = (v: SimpleValidators, shouldWrap = true): string => {
  const name = ValidatorToString[v];
  return shouldWrap ? typeToPrint(name) : name;
};

export const schemaRecordToPrint = (record: Record<string, AnySchema>): string => {
  const entries = Object.entries(record).map(([key, val]) => [key, schemaToString(val)] as const);
  if (entries.length === 0) {
    return objectToPrint('');
  }
  return objectToPrint(' ' + entries.map(([key, val]) => quote(key) + ': ' + val).join(', ') + ' ');
};

export const schemaToString = (schema: AnySchema): string => {
  if (isSimpleSchema(schema)) {
    return simpleValidatorToString(schema.__validator);
  }

  if (isLiteralSchema(schema)) {
    return literalToPrint(
      schema.__values.map((v) => (isSchema(v) ? schemaToString(v) : String(v))),
    );
  }

  if (isArraySchema(schema)) {
    return arrayToPrint(
      schema.__validator.map((s) =>
        isSchema(s) && isSimpleSchema(s)
          ? simpleValidatorToString(s.__validator, false)
          : schemaToString(s),
      ),
    );
  }

  return schemaRecordToPrint(schema.__validator);
};

export class ValidationError extends Error {
  public readonly details: ErrorDetails;

  constructor(schema: SomeSchema<any>, value: any) {
    const expected = schemaToString(schema);
    const got = JSON.stringify(value);

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
