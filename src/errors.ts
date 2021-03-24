import { schemaToString } from './stringify';
import type { SomeSchema } from './types';

export class ValidationError extends Error {
  public readonly details: ErrorDetails;

  constructor(schema: SomeSchema<any>, value: any, result?: unknown) {
    const expectedStr = schemaToString(schema);
    const gotStr = typeof value === 'function' ? String(value) : JSON.stringify(value);

    const details: ErrorDetails = {
      fields: result,
    };
    super(`Invalid type! Expected ${expectedStr} but got ${gotStr}!`);

    this.details = details;
    this.name = 'ValidationError';
    Error.captureStackTrace(this);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

type ErrorDetails = {
  readonly fields: any;
};
