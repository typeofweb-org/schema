import type { Either } from '../types';

export const left = <L>(value: L): Either<never, L> => ({ _t: 'left', value });
export const right = <R>(value: R): Either<R, never> => ({ _t: 'right', value });

export type Next<Output> = { readonly _t: 'next'; readonly value: Output };
export const next = <Output>(value: Output): Next<Output> => ({ _t: 'next', value });
