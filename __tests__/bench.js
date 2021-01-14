'use strict';
exports.__esModule = true;
var src_1 = require('./dist/index.common.js');
function run(i) {
  var schema = src_1.object({
    name: src_1.minLength(4)(src_1.string()),
    email: src_1.string(),
    firstName: src_1.nonEmpty(src_1.string()),
    phone: src_1.nonEmpty(src_1.string()),
    age: src_1.number(),
  });
  var validator = src_1.validate(schema);
  var obj = {
    name: 'John Doe',
    email: 'john.doe@company.space',
    firstName: 'John',
    phone: '123-4567',
    age: i,
  };
  return validator(obj);
}
for (var i = 0; i < 1000000; ++i) {
  run(i);
}
