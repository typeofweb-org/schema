---
id: validate
title: validate
---

`validate` is a function that returns a `validator function`. `validator function` is used to validate data and to provide the correct type of the data.

## Parsing behaviour of `validate`

```ts
const numberSchema = number();
const numberValidator = validate(numberSchema);
const luckyNumber = '2';

// Returns 2 & type of dayOfTheWeek is `number`
const dayOfTheWeek = numberValidator(luckyNumber);
```

```ts
const stringSchema = string();
const stringValidator = validate(stringSchema);
const aprilFoolsDay = new Date('April 1, 2021 00:00:00');

// Returns "2021-03-31T22:00:00.000Z" & type of ISOString is `string`
const ISOString = stringValidator(aprilFoolsDay);
```

```ts
const dateSchema = date();
const dateValidator = validate(dateSchema);
const ISOString = '2021-03-31T22:00:00.000Z';

// Returns Date Thu Apr 01 2021 00:00:00 GMT+0200 (Central European Summer Time) & type of aprilFoolsDay is `Date`
const aprilFoolsDay = dateValidator(ISOString);
```
