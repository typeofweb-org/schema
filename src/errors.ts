import { schemaToString } from './stringify';

import type { Either, SomeSchema, Next, ErrorData } from './types';

export class ValidationError extends Error {
  public readonly details: ErrorData;

  constructor(schema: SomeSchema<any>, value: any, context: Either<never> | Next<never>) {
    const expected = schemaToString(schema);
    const got = typeof value === 'function' ? String(value) : JSON.stringify(value);

    super(`Invalid type! Expected ${expected} but got ${got}!`);

    this.details = context.value;

    this.name = 'ValidationError';
    Error.captureStackTrace(this);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
