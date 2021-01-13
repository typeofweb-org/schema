import type { VALIDATORS } from './validators';

export type TypeOf<T extends AnySchema> =
  | If<T['__modifiers'], { readonly optional: true }, undefined>
  | If<T['__modifiers'], { readonly nullable: true }, null>
  | (T['__values'][number] extends never ? T['__type'] : T['__values'][number]);

type DefaultModifiers<L extends number = number> = {
  readonly optional?: boolean;
  readonly nullable?: boolean;
  readonly minLength?: L;
};

export interface Schema<Type extends unknown, Modifiers extends DefaultModifiers, Values> {
  readonly __type: Type;
  readonly __validator: VALIDATORS;
  readonly __values: readonly Values[];
  readonly __modifiers: Modifiers;
}

export type AnySchema = Schema<any, DefaultModifiers, any>;

export type SomeSchema<T> = Schema<T, DefaultModifiers, any>;

export type If<T, Obj, Y, N = never> = T extends Obj ? Y : N;
