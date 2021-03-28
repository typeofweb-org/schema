import type { Either, Next, ErrorData } from '../types';

export const left = <L extends ErrorData>(value: L): Either<never, L> => ({ _t: 'left', value });
export const right = <R>(value: R): Either<R, never> => ({ _t: 'right', value });
export const nextValid = <Output>(value: Output): Next<Output> => ({ _t: 'nextValid', value });
export const nextNotValid = <L extends ErrorData>(value: L): Next<L> => ({
  _t: 'nextNotValid',
  value,
});
