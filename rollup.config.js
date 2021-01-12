// @ts-check
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import prettier from 'rollup-plugin-prettier';
import { terser } from "rollup-plugin-terser";

import pkg from './package.json';

const rollupConfig = [
  {
    input: 'src/index.ts',
    output: [
      {
        name: '@typeofweb/schema',
        format: 'es',
        dir: './',
        entryFileNames: pkg.module,
        plugins: [
          prettier({
            parser: 'typescript'
          }),
        ]
      },
      {
        name: '@typeofweb/schema',
        format: 'cjs',
        dir: './',
        entryFileNames: pkg.main,
        plugins: [
          prettier({
            parser: 'typescript'
          }),
        ]
      },
      {
        name: '@typeofweb/schema',
        entryFileNames: pkg.browser,
        format: 'umd',
        dir: './',
        plugins: [
          terser({
            compress: true,
            mangle: true,
            ecma: 2020,
          })
        ]
      },
    ],
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
      typescript({
        tsconfig: "tsconfig.json",
        declaration: true,
        declarationDir: 'dist/',
        rootDir: 'src/',
        module: "ES2020",
        resolveJsonModule: false
      }),
    ],
  },
];
// eslint-disable-next-line import/no-default-export
export default rollupConfig;
