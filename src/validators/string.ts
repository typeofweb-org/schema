import { refine } from '../refine';
import { typeToPrint } from '../stringify';
import { isDate } from '../utils/dateUtils';

export const string = refine(
  (value, t) => {
    const parsedValue = parseString(value);
    if (typeof parsedValue !== 'string') {
      return t.left(parsedValue);
    }
    return t.nextValid(parsedValue);
  },
  () => typeToPrint('string'),
);

function parseString(value: unknown) {
  if (isDate(value)) {
    return value.toISOString();
  }
  return value;
}
