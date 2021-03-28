import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const boolean = refine(
  (value, t) => {
    if (typeof value !== 'boolean') {
      return t.left({
        expected: 'boolean',
        got: value,
      });
    }
    return t.nextValid(value);
  },
  () => typeToPrint('boolean'),
);
