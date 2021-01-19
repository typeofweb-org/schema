---
id: nonempty
title: nonEmpty
---

The `nonEmpty` modifier can be applied to `string` or `array` schemas in order to make sure they contain at least one character or one item respectively.

```ts
const nonEmptyArrayValidator = validate(nonEmpty(array(string())));

// Returns ['a', 'b', 'c']
const ok = nonEmptyArrayValidator(['a', 'b', 'c']);

// Throws ValidationError
const notOk = nonEmptyArrayValidator([]);
```

The `nonEmpty` modifier also changes the return type of the validation – it's a variadic tuple instead of an array:

```ts
// readonly [string, ...string[]]
const nonEmptyResult = validate(nonEmpty(array(string())))(['a']);
```

You can read more about it in the `minLength` section below. Technically speaking the implementation of the `nonEmpty` is as simple as:

```ts
const nonEmpty = minLength(1);
```
