import { refine } from '../refine';
import { unionToPrint } from '../stringify';

export const nil = refine(
  (value, t) => (value === null || value === undefined ? t.right(value) : t.nextNotValid(value)),
  (outerToString) => [unionToPrint([...(outerToString?.() ?? []), `undefined`, `null`])],
);
