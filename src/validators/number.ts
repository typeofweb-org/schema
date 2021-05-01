import { refine } from '../refine';

export const number = refine((value, t) => {
  const parsedValue = parseNumber(value);
  if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
    return t.left(value);
  }
  return t.nextValid(parsedValue);
}, 'number');

function parseNumber(value: unknown) {
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return value;
    }
    return Number(value);
  }
  return value;
}
