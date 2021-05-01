import { refine } from '../refine';
import { isDate } from '../utils/dateUtils';

export const string = refine((value, t) => {
  const parsedValue = parseString(value);
  if (typeof parsedValue !== 'string') {
    return t.left(value);
  }
  return t.nextValid(parsedValue);
}, 'string');

function parseString(value: unknown) {
  if (isDate(value)) {
    return value.toISOString();
  }
  return value;
}
