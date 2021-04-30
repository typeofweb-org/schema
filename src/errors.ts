import { schemaToString } from './stringify';
import type { Primitives, SomeSchema } from './types';

export type Result = Record<string, ValidationError> | Primitives | Date | ValidationError;

export class ValidationError extends Error {
  public readonly details: ErrorDetails;
  private readonly schema: SomeSchema<any> | undefined;
  private readonly value: unknown;
  private readonly result?: Result;

  constructor(schema?: SomeSchema<any> | undefined, value?: unknown, result?: Result) {
    const expectedStr = schemaToString(schema);
    const gotStr = typeof value === 'function' ? String(value) : JSON.stringify(value);

    const details: ErrorDetails = {
      fields: result,
    };
    super(`Invalid type! Expected ${expectedStr} but got ${gotStr}!`);

    this.details = details;
    this.name = 'ValidationError';
    this.schema = schema;
    this.value = value;
    this.result = result;
    Error.captureStackTrace(this);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  getDetails(): Record<string, any> {
    if (this.result instanceof ValidationError) {
      return this.result.getDetails();
    } else if (typeof this.result === 'object' && this.result && !Array.isArray(this.result)) {
      return Object.fromEntries(
        Object.entries(this.result).map(([key, error]) => {
          if (error instanceof ValidationError) {
            return [key, error.getDetails()];
          }
          return [key, error];
        }),
      );
    } else {
      return { expected: schemaToString(this.schema), got: this.value };
    }
  }
}

type ErrorDetails = {
  readonly fields: any;
};
