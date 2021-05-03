import type { Either, Next, ErrorData } from '../types';

export const left = <L extends ErrorData>(value: L): Either<never, L> => ({ _t: 'left', value });
export const right = <R>(value: R): Either<R, never> => ({ _t: 'right', value });
export const nextValid = <Output>(value: Output): Next<Output> => ({ _t: 'nextValid', value });
export const nextNotValid = <T, L extends ErrorData<T>>(value: L): Next<T> => ({
  _t: 'nextNotValid',
  value,
});
