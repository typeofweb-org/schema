import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const boolean = refine(
  (value, t) => {
    if (typeof value !== 'boolean') {
      return t.left(value);
    }
    return t.next(value);
  },
  () => typeToPrint('boolean'),
);
