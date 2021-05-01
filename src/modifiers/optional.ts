import { refine } from '../refine';

export const optional = refine(
  (value, t) => (value === undefined ? t.right(undefined) : t.nextNotValid(value)),
  `undefined`,
);
