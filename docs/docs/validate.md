---
id: validate
title: validate
---

`validate` is a function that returns a `validator function`. `validator function` is used to validate data and to provide the correct type of the data.

## Parsing behaviour of `validate`

`@typeofweb/schema` comes with a default set of sane coercion rules, meaning some of the most common scenarioes are covered out of the box!

### Example

```ts
import Qs from 'qs';

const queryString = `dateFrom=2020-10-15&dateTo=2020-10-15&resultsPerPage=10`;

const parsedQuery = Qs.parse(queryString);

const queryValidator = validate(
  object({
    dateFrom: date(),
    dateTo: date(),
    resultsPerPage: number(),
  })(),
);

const queryObject = queryValidator(parsedQuery);
// {
//   dateFrom: new Date('2020-10-15T00:00:00.000Z'), // date instance
//   dateTo: new Date('2020-10-15T00:00:00.000Z'), // date instance
//   resultsPerPage: 10 // number
// }
```

### Numeric strings are converted to numbers

Sometimes, numbers are passed as strings i.e. in query strings. We found out this kind of scenario is very common and thus we automatically convert numeric strings to numbers.

```ts
const numberSchema = number();
const numberValidator = validate(numberSchema);
const luckyNumber = '2';

// Returns 2 & type of dayOfTheWeek is `number`
const dayOfTheWeek = numberValidator(luckyNumber);
```

### Dates get stringified

```ts
const stringSchema = string();
const stringValidator = validate(stringSchema);
const aprilFoolsDay = new Date('April 1, 2021 00:00:00');

// Returns "2021-03-31T22:00:00.000Z" & type of ISOString is `string`
const ISOString = stringValidator(aprilFoolsDay);
```

### Date strings are converted to `Date` instances

JSON format doesn't support Date instances and usually strings in ISO 8601 format are used instead. We thought it makes sense to automatically convert them to proper `Date` instances.

```ts
const dateSchema = date();
const dateValidator = validate(dateSchema);
const ISOString = '2021-03-31T22:00:00.000Z';

// Returns Date Thu Apr 01 2021 00:00:00 GMT+0200 (Central European Summer Time) & type of aprilFoolsDay is `Date`
const aprilFoolsDay = dateValidator(ISOString);
```
