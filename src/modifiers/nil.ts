import { refine } from '../refine';

export const nil = refine(
  (value, t) => (value === null || value === undefined ? t.right(value) : t.nextNotValid(value)),
  () => [`undefined`, `null`],
);
