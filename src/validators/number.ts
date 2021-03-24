import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const number = refine((value, t) => {
  const parsedValue = parseNumber(value);
  if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
    return t.left(numberToString());
  }
  return t.nextValid(parsedValue);
}, numberToString);

function numberToString() {
  return typeToPrint('number');
}

function parseNumber(value: unknown) {
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return value;
    }
    return Number(value);
  }
  return value;
}
