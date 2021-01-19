---
id: oneOf
title: oneOf
---

Creates a schema that matches only specified values.

```ts
const fishSchema = oneOf(['trout', 'catfish']);
const fishValidator = validate(fishSchema);

// Returns 'trout'
const trout = fishValidator('trout');

// Throws ValidationError
const salmon = fishValidator('salmon');
```
