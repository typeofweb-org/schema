---
id: string
title: string
---

Creates a schema that matches strings.

```ts
const stringSchema = string();
const stringValidator = validate(stringSchema);

// Returns 'Michael'
const michael = stringValidator('Michael');
```
