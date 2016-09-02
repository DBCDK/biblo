/**
 * @file: exports function which clones an object into a new object
 */

const assign = Object.assign || require('object-assign');

// Be aware that this makes a shallow copy only. Nested objects are still copied as references
export default function assignToEmpty(oldObj, newObj) {
  return assign({}, oldObj, newObj);
}
