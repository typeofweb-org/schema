import { object, optional, string, validate } from '../src';

describe('prototype pollution', () => {
  it('do not allow __proto__ polution', () => {
    const obj = {} as { readonly polluted?: string };

    expect(obj.polluted).toBe(undefined);
    const schema = object({
      __proto__: object({
        polluted: string(),
      })(),
    })();
    expect(() => validate(schema)({ __proto__: { polluted: true } })).not.toThrowError();
    expect(obj.polluted).toBe(undefined);
    // @ts-ignore
    expect(Object.polluted).toBe(undefined);
  });

  it('do not allow prototype polution', () => {
    const obj = {} as { readonly polluted?: string };

    expect(obj.polluted).toBe(undefined);
    const schema = optional(
      object({
        prototype: optional(
          object({
            polluted: optional(string()),
          })(),
        ),
      })(),
    );
    expect(() => validate(schema)(Object)).toThrowError();
    expect(obj.polluted).toBe(undefined);
    // @ts-ignore
    expect(Object.polluted).toBe(undefined);
  });

  it('do not allow constructor polution', () => {
    const obj = {} as { readonly polluted?: string };

    expect(obj.polluted).toBe(undefined);
    const t = {};
    const schema = object({
      constructor: optional(object({ polluted: optional(string()) })()),
    })();
    expect(() => validate(schema)(t)).not.toThrowError();
    expect(typeof t.constructor).toBe('function');
    expect(obj.polluted).toBe(undefined);
    // @ts-ignore
    expect(Object.polluted).toBe(undefined);
  });

  it('do not allow constructor.prototype polution', () => {
    const obj = {} as { readonly polluted?: string };

    expect(obj.polluted).toBe(undefined);
    const schema = object({
      constructor: object({
        prototype: object({
          polluted: string(),
        })(),
      })(),
    })();
    expect(() =>
      validate(schema)({ constructor: { prototype: { polluted: 'yes' } } }),
    ).not.toThrowError();
    expect(obj.polluted).toBe(undefined);
    // @ts-ignore
    expect(Object.polluted).toBe(undefined);
  });
});
