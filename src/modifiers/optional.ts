import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const optional = refine(
  (value, t) =>
    value === undefined
      ? t.right(undefined)
      : t.nextNotValid({
          expected: 'optional',
          got: value,
        }),
  () => typeToPrint('undefined'),
);
