/* eslint-disable functional/no-this-expression */

import { schemaToString } from './stringify';
import type { SomeSchema } from './types';

export class ValidationError extends Error {
  public readonly details: ErrorDetails;

  constructor(schema: SomeSchema<any>, value: any) {
    const expected = schemaToString(schema);
    const got = typeof value === 'function' ? String(value) : JSON.stringify(value);

    const details: ErrorDetails = {
      kind: 'TYPE_MISMATCH',
      got,
      expected,
    };
    super(`Invalid type! Expected ${details.expected} but got ${details.got}!`);

    this.details = details;
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
