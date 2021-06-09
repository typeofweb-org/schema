// @ts-check
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import prettier from 'rollup-plugin-prettier';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';

import pkg from './package.json';

const shouldCompress = process.env.COMPRESS_BUNDLES ? true : false;

const rollupConfig = [
  {
    input: 'src/index.ts',
    output: [
      {
        name: '@typeofweb/schema',
        format: 'es',
        dir: './',
        entryFileNames: pkg.exports.import.replace(/^\.\//, ''),
        sourcemap: true,
        plugins: [
          shouldCompress
            ? terser({
                compress: true,
                mangle: true,
                ecma: 2019,
              })
            : prettier({
                parser: 'typescript',
              }),
        ],
      },
      {
        name: '@typeofweb/schema',
        format: 'cjs',
        dir: './',
        entryFileNames: pkg.exports.require.replace(/^\.\//, ''),
        sourcemap: true,
        plugins: [
          shouldCompress
            ? terser({
                compress: true,
                mangle: true,
                ecma: 2019,
              })
            : prettier({
                parser: 'typescript',
              }),
        ],
      },
      {
        name: '@typeofweb/schema',
        entryFileNames: pkg.exports.browser.replace(/^\.\//, ''),
        sourcemap: true,
        format: 'umd',
        dir: './',
        plugins: [
          terser({
            compress: true,
            mangle: true,
            ecma: 2019,
          }),
        ],
      },
    ],
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
      typescript({
        tsconfig: 'tsconfig.json',
        declaration: true,
        declarationDir: 'dist/',
        rootDir: 'src/',
        include: ['src/**/*.ts'],
      }),
      filesize({}),
      license({
        banner: `
<%= pkg.name %>@<%= pkg.version %>
Copyright (c) <%= moment().format('YYYY') %> Type of Web - Michał Miszczyszyn

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
`.trim(),
      }),
    ],
  },
];
// eslint-disable-next-line import/no-default-export
export default rollupConfig;
