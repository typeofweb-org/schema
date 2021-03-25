import { ErrorDataBasic } from '../errors';
import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const boolean = refine(
  (value, t) => {
    if (typeof value !== 'boolean') {
      return t.left(new ErrorDataBasic('boolean', value));
    }
    return t.nextValid(value);
  },
  () => typeToPrint('boolean'),
);
