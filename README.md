# @typeofweb/schema

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![codecov](https://codecov.io/gh/typeofweb/schema/branch/main/graph/badge.svg?token=6DNCIHEEUO)](https://codecov.io/gh/typeofweb/schema)
[![npm](https://img.shields.io/npm/v/@typeofweb/schema.svg)](https://www.npmjs.com/package/@typeofweb/schema)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@typeofweb/schema.svg)](https://www.npmjs.com/package/@typeofweb/schema)

## Table of contents

- [Introduction](#introduction)
- [Contributors ✨](#contributors-)
- [Installation](#installation)
- [Example](#example)
- [API](#api)
  - [oneOf](#oneOf)
  - [string](#string)
  - [number](#number)
  - [boolean](#boolean)
  - [date](#date)
  - [object](#object)
  - [array](#array)
  - [Modifiers](#modifiers)
    - [nullable](#nullable)
    - [optional](#optional)
    - [nil](#nil)
    - [nonEmpty](#nonEmpty)
    - [minLength](#minLength)

## Introduction

`@typeofweb/schema` is a lightweight and extensible library for data validation with full support for TypeScript!

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://typeofweb.com/"><img src="https://avatars0.githubusercontent.com/u/1338731?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michał Miszczyszyn</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=mmiszy" title="Code">💻</a> <a href="#maintenance-mmiszy" title="Maintenance">🚧</a> <a href="#projectManagement-mmiszy" title="Project Management">📆</a> <a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3Ammiszy" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/wisnie"><img src="https://avatars3.githubusercontent.com/u/47081011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bartłomiej Wiśniewski</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=wisnie" title="Code">💻</a> <a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3Awisnie" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/AdamSiekierski"><img src="https://avatars0.githubusercontent.com/u/24841038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Siekierski</b></sub></a><br /><a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3AAdamSiekierski" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Installation

Install the package with npm:

`npm install @typeofweb/schema`

or install the package with yarn:

`yarn add @typeofweb/schema`

## Example

```js
const personSchema = object({
  name: string(),
  age: number(),
  email: optional(string()),
});

const mark = {
  name: 'Mark',
  age: 29,
};

const personValidator = validate(personSchema);

// If validation is successful returns data with correct type, throws ValidationError otherwise
const validatedPerson = personValidator(mark);
```

## API

### oneOf

Creates a schema that matches only specified values.

```ts
const fishSchema = oneOf(['trout', 'catfish']);
const fishValidator = validate(fishSchema);

// Returns 'trout'
const trout = fishValidator('trout');

// Throws ValidationError
const salmon = fishValidator('salmon');
```

### string

Creates a schema that matches strings.

```ts
const stringSchema = string();
const stringValidator = validate(stringSchema);

// Return 'Micheal'
const micheal = stringValidator('Micheal');
```

### number

Creates a schema that matches numbers.

```ts
const numberSchema = number();
const numberValidator = validate(numberSchema);

// Returns 3.14
const pi = numberValidator(3.14);
```

### boolean

Creates a schema that matches booleans.

```ts
const booleanSchema = boolean();
const booleanValidator = validate(booleanSchema);

// Returns true
const loading = booleanValidator(true);
```

### date

Creates a schema that matches JavaScript `Date` objects.

```ts
const dateSchema = date();
const dateValidator = validate(dateSchema);

// Returns Date Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)
const annieBirthday = dateValidator(
  new Date('Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)'),
);
```

### object

Creates a schema that matches objects of provided shape.

```ts
const carSchema = object({
  manufacturer: string(),
  model: string(),
  mass: number(),
  enginePower: number(),
  fuelCapacity: number(),
});
const carValidator = validate(carSchema);

/* Returns {
  manufacturer: 'Type of Web Enterprise',
  model: 'x1024',
  mass: 1600,
  enginePower: 135,
  fuelCapacity: 59,
} */
const matthewCar = carValidator({
  manufacturer: 'Type of Web Enterprise',
  model: 'x1024',
  mass: 1600,
  enginePower: 135,
  fuelCapacity: 59,
});
```

### array

Creates a schema that matches arrays containing values specified by the schemas passed as parameters.

```ts
const musicGenresSchema = array(string());
const musicGenresValidator = validate(musicGenresSchema);

// Returns ['classical', 'lofi', 'pop']
const musicGenres = musicGenresValidator(['classical', 'lofi', 'pop']);

const primitiveValidator = validate(array(string(), number(), boolean()));
primitiveValidator([false, 'string', 123, 42, ':)']); // OK
```

### Modifiers

Modifiers are used to customize schemas and change their validation behaviour.

#### nullable

If you use the `nullable` modifier, given schema will be extended to also match `null` values, and its output type will be `null | T`.

```ts
const nullableRoleSchema = nullable(oneOf(['User', 'Admin']));
const nullableRoleValidator = validate(nullableRoleSchema);

// Returns 'User', the output type is null | 'User' | 'Admin'
const role = nullableRoleValidator('User');

// It's also fine
nullableRoleValidator(null);

// Throws ValidationError
nullableRoleValidator();
nullableRoleValidator(undefined);
```

#### optional

If you use the `optional` modifier, given schema will be extended to also match `undefined` values, and its output type will be `undefined | T`.

```ts
const optionalRoleSchema = optional(oneOf(['User', 'Admin']));
const optionalRoleValidator = validate(optionalRoleSchema);

// Returns 'User', the output type is undefined | 'User' | 'Admin'
const role = optionalRoleValidator('User');

// It's also fine
optionalRoleValidator();
optionalRoleValidator(undefined);

// Throws validation error
optionalRoleValidator(null);
```

#### nil

If you use the `nil` modifier, given schema will be extended to also match `null` and `undefined` values, and its output type will be `null | undefined | T`.

```ts
const nilRoleSchema = nil(oneOf(['User', 'Admin']));
const nilRoleValidator = validate(nilRoleSchema);

// Returns 'User', the output type is undefined | null | 'User' | 'Admin'
const role = nilRoleValidator('User');

// It's also fine
nilRoleValidator();
nilRoleValidator(undefined);
nilRoleValidator(null);
```

#### nonEmpty

The `nonEmpty` modifier can be applied to `string` or `array` schemas in order to make sure they contain at least one character or one item respectively.

```ts
const nonEmptyArrayValidator = validate(nonEmpty(array(string())));

// OK
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

#### minLength

The `minLength` modifier is used to contraint length of `string` or `array` values.

```ts
const atLeastTwoCharsValidator = validate(minLength(2)(string()));

// OK
const ok = atLeastTwoCharsValidator('ok');

// Throws ValidationError
const notOk = atLeastTwoCharsValidator('?');
```

The `minLength` modifier also changes the return validation type when used on arrays. In such case arrays become tuples with given number of elements:

```ts
const len10Validator = validate(minLength(10)(array(number())));
// type of result is
// readonly [string, string, string, string, string, string, string, string, string, string, ...string[]]
const result = validate(len10)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
```

As a result, it makes using such arrays/tuples more typesafe. Notice how the type of the `eleventhElement` is different:

```ts
// number
const firstElement = result[0];
// number
const tenthElement = result[9];
// number | undefined
const eleventhElement = result[9];
```

##### Type instantiation is excessively deep and possibly infinite

On rare occasions you may come across the following TypeScript error: _Type instantiation is excessively deep and possibly infinite.ts(2589)_. It's a limitation of the TypeScript compiler when used on very deeply nested conditional types such as the tuples generated by the `minLength` modifier.

Should this issue ever occur to you, please override the inferred generic parameter with `number`:

```ts
// errors in compile-time
const whoopsieDaisyValidator = validate(minLength(100000)(array(number())))([]);

// fallback to less-typesafe array: readonly number[]
const better = validate(minLength<number>(100000)(array(number())))([]);
```
