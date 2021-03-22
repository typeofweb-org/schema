# @typeofweb/schema

`@typeofweb/schema` is a lightweight and extensible library for data validation with full TypeScript support!

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![codecov](https://codecov.io/gh/typeofweb/schema/branch/main/graph/badge.svg?token=6DNCIHEEUO)](https://codecov.io/gh/typeofweb/schema)
[![npm](https://img.shields.io/npm/v/@typeofweb/schema.svg)](https://www.npmjs.com/package/@typeofweb/schema)
[![npm bundle size (minified + gzip)](https://badgen.net/bundlephobia/minzip/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)
[![no external dependencies](https://badgen.net/bundlephobia/dependency-count/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)
[![tree-shakeable](https://badgen.net/bundlephobia/tree-shaking/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)

## Docs

### 👉 [schema.typeofweb.com](https://schema.typeofweb.com/) 👈

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://typeofweb.com/"><img src="https://avatars0.githubusercontent.com/u/1338731?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michał Miszczyszyn</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=mmiszy" title="Code">💻</a> <a href="#maintenance-mmiszy" title="Maintenance">🚧</a> <a href="#projectManagement-mmiszy" title="Project Management">📆</a> <a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3Ammiszy" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/wisnie"><img src="https://avatars3.githubusercontent.com/u/47081011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bartłomiej Wiśniewski</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=wisnie" title="Code">💻</a> <a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3Awisnie" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/typeofweb/schema/issues?q=author%3Awisnie" title="Bug reports">🐛</a> <a href="https://github.com/typeofweb/schema/commits?author=wisnie" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/AdamSiekierski"><img src="https://avatars0.githubusercontent.com/u/24841038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Siekierski</b></sub></a><br /><a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3AAdamSiekierski" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/asottile"><img src="https://avatars3.githubusercontent.com/u/1810591?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anthony Sottile</b></sub></a><br /><a href="#security-asottile" title="Security">🛡️</a></td>
    <td align="center"><a href="https://devalchemist.com"><img src="https://avatars.githubusercontent.com/u/1423385?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marek</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=malydok" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Example

```ts
import { number, object, optional, string, validate } from '@typeofweb/schema';

const personSchema = object({
  name: string(),
  age: number(),
  email: optional(string()),
})();

const mark = {
  name: 'Mark',
  age: 29,
};

const personValidator = validate(personSchema);

// If validation is successful returns data with correct type, throws ValidationError otherwise
const validatedPerson = personValidator(mark);
```

## Early benchmarks

Early benchmarks show some really promising performance of `@typeofweb/schema` when compared to other industry-leading solutions:

```
Platform info:
==============
   Darwin 20.2.0 x64
   Node.JS: 14.15.2
   V8: 8.4.371.19-node.17
   Intel(R) Core(TM) i7-6920HQ CPU @ 2.90GHz × 8
```

| library               | relative speed | operations per second | avg. operation time |
| --------------------- | -------------: | --------------------: | ------------------: |
| **@typeofweb/schema** |            ref |   **(2,812,709 rps)** |  **(avg: 0.355μs)** |
| io-ts@2.2.13          |        -27.82% |       (2,030,076 rps) |      (avg: 0.492μs) |
| mschema@0.5.6         |        -79.15% |         (586,537 rps) |          (avg: 1μs) |
| validator.js@2.0.4    |        -83.22% |         (471,847 rps) |          (avg: 2μs) |
| validate.js@0.13.1    |        -91.62% |         (235,741 rps) |          (avg: 4μs) |
| validatorjs@3.22.1    |        -94.08% |         (166,599 rps) |          (avg: 6μs) |
| joi@17.3.0            |        -95.52% |         (125,992 rps) |          (avg: 7μs) |
| superstruct@0.13.3    |        -97.17% |          (79,536 rps) |         (avg: 12μs) |
| yup@0.32.8            |        -97.66% |          (65,748 rps) |         (avg: 15μs) |
| parambulator@1.5.2    |        -99.17% |          (23,308 rps) |         (avg: 42μs) |
| zod@1.11.11           |        -99.36% |          (18,126 rps) |         (avg: 55μs) |

### 👉 [schema.typeofweb.com](https://schema.typeofweb.com/) 👈
