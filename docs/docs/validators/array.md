---
id: array
title: array
---

Creates a schema that matches arrays containing values specified by the schemas passed as parameters:

```ts
const musicGenresSchema = array(string())();
const musicGenresValidator = validate(musicGenresSchema);

// Returns ['classical', 'lofi', 'pop']
const musicGenres = musicGenresValidator(['classical', 'lofi', 'pop']);
```

```ts
const primitiveValidator = validate(array(string(), number(), boolean())());
// Returns [false, 'string', 123, 42, ':)']
primitiveValidator([false, 'string', 123, 42, ':)']);
```
