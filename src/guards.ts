import type { ErrorData, ErrorDataObject } from './types';

export function isErrorDataObject<T>(value: ErrorData<T>): value is ErrorDataObject<T> {
  return 'errors' in value;
}
