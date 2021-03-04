---
id: minStringLength
title: minStringLength
---

The `minStringLength` modifier is used to contraint length of `string` or `array` values.

```ts
const atLeastTwoCharsValidator = validate(minStringLength(2)(string()));

// Returns 'ok'
const ok = atLeastTwoCharsValidator('ok');

// Throws ValidationError
const notOk = atLeastTwoCharsValidator('?');
```
