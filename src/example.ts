import { ValidationError } from './errors'; // is not removed

export const a = `stays as it's an export`;

const b = 'will be removed';

function object() {
  new ValidationError({} as any, {});
}
