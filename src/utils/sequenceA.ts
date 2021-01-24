/* eslint-disable functional/no-loop-statement */
import type { ValidationError } from '../errors';
import type { Functor, Either } from '../types';

import { left, right } from './either';

export const sequenceA = <
  Input extends Readonly<Functor<unknown>>,
  Output extends Readonly<Functor<unknown>>
>(
  fn: (
    value: Input[keyof Input],
    index: keyof Input,
    iterable: Input,
  ) => Either<Output[keyof Output]>,
  functor: Input,
) => {
  let acc = right(Array.isArray(functor) ? [] : {}) as Either<Output, Functor<ValidationError>>;

  for (const i in functor) {
    if (!Object.prototype.hasOwnProperty.call(functor, i)) {
      continue;
    }

    const result = fn(functor[i], i as any, functor);

    if (result._t === 'left') {
      if (acc._t === 'left') {
        (acc.value as Record<typeof i, ValidationError>)[i] = result.value;
        continue;
      } else {
        acc = left(Array.isArray(functor) ? [result.value] : { [i]: result.value });
        continue;
      }
    }
    if (acc._t === 'left') {
      continue;
    }

    acc.value[i as keyof Output] = result.value;
  }
  return acc;
};
