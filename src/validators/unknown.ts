import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const unknown = refine(
  (value, t) => {
    return t.nextValid(value);
  },
  () => typeToPrint('unknown'),
);
