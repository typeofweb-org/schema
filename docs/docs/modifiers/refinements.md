---
id: refinements
title: Custom modifiers (refinements)
---

`@typeofweb/schema` is almost infinitely extensible thanks to the `refine` function. It can be used to:

- create custom validators
- modify or adjust validators which are built-in
- parse data before validating

## `refine`

`refine` takes two parameters both of which are functions. First of them is a "refinement function" which is where the implementation details go. Such a function is given `value: unknown` as its first parameter and `t: RefinementToolkit` as second:

```ts
refine((value, t) => {
  // …
});
```

`value` is, well, the value passed to the validator, and `t` is an object which contains four functions: `right`, `left`, `nextValid`, and `nextNotValid`, all of which are described in detail below.

Second parameter of `refine` is another function which is used for stringifying the validator for error purposes:

```ts
refine(
  (value, t) => {
    // …
  },
  () => 'XXX',
);
```

Such a validator would throw `Invalid type! Expected XXX but got …!` in case it's fed with invalid data.

## `RefinementToolkit`

As mentioned in the previous paragraph, `RefinementToolkit` consists of 3 functions: `right`, `left`, and `next`. They all play a different role and are equally useful when creating custom validators or modifiers:

- `right(value)` – ends validation with a success and `value`
- `left(value)` – ends validation with an error
- `nextValid(value)` – continues validation if there are other validators after it; success otherwise
- `nextNotValid(value)` – continues validation if there are other validators after it; fail otherwise

In most of the cases you'll want to use `left` and `nextValid`.

Let's look at a few short examples of where each of these functions comes handy:

```ts
export const optional = refine((value, t) =>
  value === undefined ? t.right(undefined) : t.nextNotValid(value),
);

const presentOrFuture = refine((value: Date, t) =>
  value.getTime() >= Date.now() ? t.nextValid(value) : t.left(value),
);
```

`optional` is a built-in validator which either succeeds instantly if given value is equal to `undefined` (`t.right`) or passes it along to the next validator. In case there are no other validators in the pipeline, validation fails because the value is clearly not `undefined`.

`presentOrFuture` is a validator meant to be used after the `date` validator. It's role is to determine if given date is present or in the future, and if it is so, it should pass the date to another validator in line (`t.nextValid`). However, if given date is in the past, we expect this validator to short circuit and finish with an error (`t.left`).

`t.nextValid` and `t.left` are most commonly used. Use `t.right` sparingly only if you're certain no further validation will ever be required on given value. `t.nextNotValid` is meant for refinements which are supposed to extend other validators – such as optional, nullable or nil.

## Custom validator

As a matter of fact, all built-in validators are now implemented using the `refine` function. Let's look at the `number` implementation:

```ts
export const number = refine(
  (value, t) => {
    const parsedValue = parseNumber(value);
    if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
      return t.left(value);
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
```

You can create your own validators in the same manner.

## Modify validators

## Parse data

Another common scenario is allowing timestamps where dates are expected. We can create a refinement which takes a timestamp and converts it to a `Date` instance before further validation is executed:

```ts
const allowTimestamps = refine((value, t) =>
  typeof value === 'number' ? t.nextValid(new Date(value)) : t.nextValid(value),
);

λ(date, allowTimestamps, validate)(1231231231231); // new Date(1231231231231) Tue Jan 06 2009 09:40:31 GMT+0100
```
