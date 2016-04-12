/**
 * @file: exports function which clones an object into a new object
 */

const assign = Object.assign || require('object-assign');

export default function assignToEmpty(oldObj, newObj) {
  return assign({}, oldObj, newObj);
}
