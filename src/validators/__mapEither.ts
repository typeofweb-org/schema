/* eslint-disable functional/no-loop-statement */
import type { ValidationError } from '../errors';
import type { Either } from '../types';

/* eslint-disable-next-line functional/prefer-readonly-type */
type Iterable<T> = Record<string, T> | T[];

export const __mapEither = <
  Input extends Readonly<Iterable<unknown>>,
  Output extends Readonly<Iterable<unknown>>
>(
  fn: (
    value: Input[keyof Input],
    index: Input extends readonly unknown[] ? number & keyof Input : string & keyof Input,
    iterable: Input,
  ) => Either<Output[keyof Output]>,
  iterable: Input,
) => {
  let acc = { _t: 'right', value: Array.isArray(iterable) ? [] : {} } as Either<
    Output,
    Iterable<ValidationError>
  >;

  for (const i in iterable) {
    const result = fn(iterable[i], i as any, iterable);

    if (result._t === 'left') {
      if (acc._t === 'left') {
        (acc.value as Record<typeof i, ValidationError>)[i] = result.value;
        continue;
      } else {
        acc = {
          _t: 'left',
          value: Array.isArray(iterable) ? [result.value] : { [i]: result.value },
        };
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
