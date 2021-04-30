import { refine } from '../refine';

export const boolean = refine(
  (value, t) => {
    if (typeof value !== 'boolean') {
      return t.left(value);
    }
    return t.nextValid(value);
  },
  () => ['boolean'],
);
