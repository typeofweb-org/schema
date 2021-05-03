import type { ErrorDataObject, ErrorDataBasic } from '../src';
import { isErrorDataObject } from '../src';

describe('guards', () => {
  describe('isErrorDataObject', () => {
    it('returns true for ErrorDataObject', () => {
      const errorData: ErrorDataObject = {
        expected: 'object',
        got: 'some string',
        errors: [],
      };
      expect(isErrorDataObject(errorData)).toBeTruthy();
    });

    it('returns false for ErrorDataBasic', () => {
      const errorData: ErrorDataBasic = {
        expected: 'object',
        got: 'some string',
      };
      expect(isErrorDataObject(errorData)).toBeFalsy();
    });
  });
});
