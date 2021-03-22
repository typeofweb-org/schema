'use strict';
exports.__esModule = true;
const { object, minStringLength, string, number, validate } = require('../dist/index.common.js');
function run(i) {
  const schema = object({
    name: minStringLength(4)(string()),
    email: string(),
    firstName: minStringLength(0)(string()),
    phone: string(),
    // age: number(),
  })();
  const validator = validate(schema);
  const obj = {
    name: 'John Doe',
    email: 'john.doe@company.space',
    firstName: 'John',
    phone: '123-4567',
    // age: i,
  };
  return validator(obj);
}
for (let i = 0; i < 4000000; ++i) {
  run(i);
}
