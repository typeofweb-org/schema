---
id: pipe
title: pipe
---

Schemas may become hard to read as nesting grows, which may be solved by function composition in the form of the provided `pipe` utility function.

```ts
pipe(string, nullable, nonEmpty);
// is equivalent to
nonEmpty(nullable(string()));
```

`λ` is an alias for `pipe`.
