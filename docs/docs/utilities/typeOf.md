---
id: typeOf
title: TypeOf<S>
---

Types can be inferred based on validators:

```ts
import { nonEmpty, minStringLength, nil, λ, object, string } from '@typeofweb/schema';
import type { TypeOf } from '@typeofweb/schema';

const blogSchema = object({
  title: λ(string, minStringLength(10)),
  description: λ(string, nil),
  href: λ(string, nil, nonEmpty),
  rssUrl: λ(string, nil, nonEmpty),
})();

type Blog = TypeOf<typeof blogSchema>;
// type Blog = {
//   readonly title: string;
//   readonly description?: string | null | undefined;
//   readonly href?: string | null | undefined;
//   readonly rssUrl?: string | null | undefined;
// }
```
