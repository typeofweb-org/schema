import { modifierToString, refine } from '../refine';

export const minStringLength = <L extends number>(minLength: L) =>
  refine(
    (value: string, t) => (value.length >= minLength ? t.nextValid(value) : t.left(value)),
    modifierToString(`minStringLength(${minLength})`),
  );
