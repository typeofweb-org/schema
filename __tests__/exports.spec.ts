/* eslint-disable import/dynamic-import-chunkname */
import Fs from 'fs';
import { resolve, extname } from 'path';

describe('check exports', () => {
  describe('validators', () => {
    const validatorsDir = Fs.readdirSync(resolve(__dirname, '..', 'src', 'validators'));
    const validators = validatorsDir
      .filter((filename) => !filename.startsWith('__'))
      .map((name) => (extname(name).length ? name.slice(0, -extname(name).length) : name));

    validators.forEach((v) => {
      it(`${v} should be exported from index.ts`, async () =>
        expect(Object.keys(await import('../'))).toContain(v));
    });
  });

  describe('modifiers', () => {
    const modifiersDir = Fs.readdirSync(resolve(__dirname, '..', 'src', 'modifiers'));
    const modifiers = modifiersDir
      .filter((filename) => !filename.startsWith('__'))
      .map((name) => (extname(name).length ? name.slice(0, -extname(name).length) : name));

    modifiers.forEach((v) => {
      it(`${v} should be exported from index.ts`, async () =>
        expect(Object.keys(await import('../'))).toContain(v));
    });
  });
});
