import type { ErrorData, ErrorDataObject } from './types';

export function isErrorDataObject(value: ErrorData): value is ErrorDataObject {
  return 'errors' in value;
}
