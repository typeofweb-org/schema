/* eslint-disable functional/no-this-expression */

declare global {
  interface Array<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }

  interface ReadonlyArray<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }
}

import type { AnySchema, Primitives, SomeSchema } from './types';
import type { SimpleSchema, SIMPLE_VALIDATORS } from './validators';
import {
  isTupleSchema,
  UNKNOWN_VALIDATOR,
  BOOLEAN_VALIDATOR,
  DATE_VALIDATOR,
  isArraySchema,
  isLiteralSchema,
  isSchema,
  isSimpleSchema,
  NUMBER_VALIDATOR,
  STRING_VALIDATOR,
} from './validators';

const validatorToString: Record<SIMPLE_VALIDATORS, string> = {
  [STRING_VALIDATOR]: 'string',
  [NUMBER_VALIDATOR]: 'number',
  [BOOLEAN_VALIDATOR]: 'boolean',
  [DATE_VALIDATOR]: 'Date',
  [UNKNOWN_VALIDATOR]: 'unknown',
};

const typeToPrint = (str: string) => '≫' + str + '≪';
const objectToPrint = (str: string) => '{' + str + '}';
const quote = (str: string) => (/\s/.test(str) ? `"${str}"` : str);
const tupleToPrint = (arr: readonly string[]) => '[' + arr.join(', ') + ']';
const arrayToPrint = (arr: readonly string[]): string => {
  const str = arr.join(' | ');

  if (arr.length > 1) {
    return typeToPrint(`(${str})[]`);
  }
  return typeToPrint(`${str}[]`);
};
const unionToPrint = (arr: readonly string[]): string => {
  const str = arr.join(' | ');

  if (arr.length > 1) {
    return `(${str})`;
  }
  return str;
};

const getModifiers = (v: SomeSchema<any>): readonly string[] => {
  const modifiers = [v.__modifiers.optional && 'undefined', v.__modifiers.nullable && 'null'];
  return modifiers.filter((m): m is string => Boolean(m));
};

const simpleSchemaToPrint = (v: SimpleSchema, shouldWrap = true): string => {
  const name = validatorToString[v.__validator];
  const modifiers = v.__validator === UNKNOWN_VALIDATOR ? [] : getModifiers(v);
  const values = [shouldWrap ? typeToPrint(name) : name, ...modifiers];
  return unionToPrint(values);
};

export const schemaRecordToPrint = (record: Record<string, AnySchema>): string => {
  const entries = Object.entries(record).map(([key, val]) => [key, schemaToString(val)] as const);
  if (entries.length === 0) {
    return objectToPrint('');
  }
  return objectToPrint(' ' + entries.map(([key, val]) => quote(key) + ': ' + val).join(', ') + ' ');
};

export const schemaToString = (schema: SomeSchema<any>): string => {
  if (isSimpleSchema(schema)) {
    return simpleSchemaToPrint(schema);
  }

  const modifiers = getModifiers(schema);

  if (isLiteralSchema(schema)) {
    return unionToPrint([
      ...(schema.__values as readonly (Primitives | AnySchema)[]).map((v) =>
        isSchema(v) ? schemaToString(v) : JSON.stringify(v),
      ),
      ...modifiers,
    ]);
  }

  if (isArraySchema(schema)) {
    return unionToPrint([
      arrayToPrint(
        schema.__validator.map((s) =>
          isSchema(s) && isSimpleSchema(s)
            ? simpleSchemaToPrint(s, false)
            : schemaToString(s as AnySchema),
        ),
      ),
      ...modifiers,
    ]);
  }

  if (isTupleSchema(schema)) {
    return unionToPrint([
      tupleToPrint(
        schema.__values.map((s) =>
          isSchema(s)
            ? isSimpleSchema(s)
              ? simpleSchemaToPrint(s)
              : schemaToString(s)
            : JSON.stringify(s),
        ),
      ),
      ...modifiers,
    ]);
  }

  return unionToPrint([
    schemaRecordToPrint(schema.__validator as Record<string, AnySchema>),
    ...modifiers,
  ]);
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
