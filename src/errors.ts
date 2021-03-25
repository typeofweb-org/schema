import { schemaToString } from './stringify';
import type { Either, SomeSchema } from './types';

export interface ErrorData {
  readonly expected: string;
  readonly got: unknown;
}

export class ErrorDataBasic implements ErrorData {
  constructor(public readonly expected: string, public readonly got: unknown) {}
}

export class ErrorDataArgs implements ErrorData {
  constructor(
    public readonly expected: string,
    public readonly got: unknown,
    public readonly args: ReadonlyArray<unknown>,
  ) {}
}

export class ObjectErrorAttr {
  constructor(public readonly path: string, public readonly error: ErrorData) {}
}

export class ErrorDataObject implements ErrorData {
  constructor(
    public readonly expected: string,
    public readonly got: unknown,
    public readonly errors: ReadonlyArray<ObjectErrorAttr>,
  ) {}
}

type ErrorInfo = ErrorDataBasic | ErrorDataObject | ErrorDataArgs;

function toErrorWithPath(error: ErrorDataBasic | ErrorDataArgs, path: string) {
  return {
    path,
    ...error,
  };
}

function objectErrorAttrToInfo(error: ObjectErrorAttr, path?: string): ErrorDetails {
  const newPath = path ? `${path}.${error.path}` : error.path;
  if (error.error instanceof ErrorDataObject) {
    return error.error.errors.flatMap((e) => objectErrorAttrToInfo(e, newPath));
  }
  return toErrorWithPath(error.error, newPath);
}

function errorInfoToArray(errorData: ErrorInfo): ErrorDetails {
  if (errorData instanceof ErrorDataObject) {
    return errorData.errors.flatMap((error) => objectErrorAttrToInfo(error));
  }
  return errorData;
}

export class ValidationError extends Error {
  public readonly details?: ErrorDetails;

  constructor(schema: SomeSchema<any>, value: any, errorData: Either<never>) {
    const expected = schemaToString(schema);
    const got = typeof value === 'function' ? String(value) : JSON.stringify(value);

    super(`Invalid type! Expected ${expected} but got ${got}!`);

    this.details = errorInfoToArray(errorData.value);

    this.name = 'ValidationError';
    Error.captureStackTrace(this);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export type ErrorDetail = {
  readonly expected: string;
  readonly got: unknown;
  readonly path?: string;
  readonly args?: ReadonlyArray<unknown>;
  readonly errors?: ReadonlyArray<ErrorDetail>;
};

export type ErrorDetails = ErrorDetail | ReadonlyArray<ErrorDetail>;
