import { refine } from '../refine';

export const nullable = refine(
  (value, t) => (value === null ? t.right(null) : t.nextNotValid(value)),
  `null`,
);
