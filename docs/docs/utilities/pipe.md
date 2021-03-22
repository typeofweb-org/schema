---
id: pipe
title: pipe (λ)
---

Schemas may become hard to read as nesting grows, which may be solved by function composition in the form of the provided `pipe` utility function.

```ts
import { nonEmpty, nullable, pipe, string } from '@typeofweb/schema';

pipe(string, nullable, nonEmpty);
// is equivalent to
nonEmpty(nullable(string()));
```

`λ` is an alias for `pipe`:

```ts
import { nonEmpty, minLength, nil, λ, object, string } from '@typeofweb/schema';

const blogSchema = object({
  title: λ(string, minLength(10)),
  description: λ(string, nil),
  href: λ(string, nil, nonEmpty),
  rssUrl: λ(string, nil, nonEmpty),
})();
```
