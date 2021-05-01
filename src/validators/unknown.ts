import { refine } from '../refine';

export const unknown = refine((value, t) => {
  return t.nextValid(value);
}, 'unknown');
