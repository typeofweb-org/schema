import { refine } from '../refine';
import type { TupleOf } from '../types';

export const minArrayLength = <L extends number>(minLength: L) =>
  refine((value: readonly unknown[], t) =>
    value.length >= minLength
      ? t.next(
          value as readonly [
            ...TupleOf<typeof value[number], L>,
            ...(readonly typeof value[number][])
          ],
        )
      : t.left(value),
  );
