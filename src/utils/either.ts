import type { Either } from '../types';

export const left = <L>(value: L) => ({ _t: 'left', value } as Either<never, L>);
export const right = <R>(value: R) => ({ _t: 'right', value } as Either<R, never>);
