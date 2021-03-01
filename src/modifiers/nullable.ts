import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const nullable = refine(
  (value, t) => (value === null ? t.right(null) : t.next(value)),
  () => typeToPrint('null'),
);
