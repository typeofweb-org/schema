import { refine } from '../refine';
import { isDate, isISODateString } from '../utils/dateUtils';

export const date = refine((value, t) => {
  const parsedValue = parseDate(value);
  if (!isDate(parsedValue) || Number.isNaN(Number(parsedValue))) {
    return t.left(value);
  }
  return t.nextValid(parsedValue);
}, 'Date');

function parseDate(value: unknown) {
  if (typeof value === 'string' && isISODateString(value)) {
    return new Date(value);
  }
  return value;
}
