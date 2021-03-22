---
id: date
title: date
---

Creates a schema that matches JavaScript `Date` objects.

```ts
const dateSchema = date();
const dateValidator = validate(dateSchema);

// Returns Date Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)
const annieBirthday = dateValidator(
  new Date('Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)'),
);
```

## Other date formats

By default, other date formats or timestamps are not supported. However, you're encouraged to create a custom refinement for this purpose. You can find a working example in [Custom modifiers (refinements)](modifiers/refinements.md).
