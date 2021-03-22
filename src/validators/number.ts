import { refine } from '../refine';
import { typeToPrint } from '../stringify';

export const number = refine(
  (value, t) => {
    const parsedValue = parseNumber(value);
    if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
      return t.left(parsedValue);
    }
    return t.nextValid(parsedValue);
  },
  () => typeToPrint('number'),
);

function parseNumber(value: unknown) {
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return value;
    }
    return Number(value);
  }
  return value;
}
