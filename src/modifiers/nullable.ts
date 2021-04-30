import { refine } from '../refine';
import { unionToPrint } from '../stringify';

export const nullable = refine(
  (value, t) => (value === null ? t.right(null) : t.nextNotValid(value)),
  (outerToString) => {
    return [unionToPrint([...[outerToString?.()].flat(2), `null`])];
  },
);
