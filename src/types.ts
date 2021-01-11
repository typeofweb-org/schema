import type { VALIDATORS } from './validators';

export type TypeOf<T extends AnySchema> =
  | If<T['__modifiers'], { optional: true }, undefined>
  | If<T['__modifiers'], { nullable: true }, null>
  | (T['__values'][number] extends never ? T['__type'] : T['__values'][number]);

export interface Schema<
  Type extends unknown,
  Modifiers extends { optional?: boolean; nullable?: boolean },
  Values
> {
  readonly __type: Type;
  readonly __validator: VALIDATORS;
  readonly __values: readonly Values[];
  readonly __modifiers: Modifiers;
}

export type AnySchema = Schema<any, { optional?: boolean; nullable?: boolean }, any>;

export type If<T, Obj, Y, N = never> = T extends Obj ? Y : N;
