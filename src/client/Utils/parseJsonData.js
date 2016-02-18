'use strict';

/**
 * @file: exports function which get jsondata from document
 */

export default function parseJsonData(id, key) {
  let jsonData = document.getElementById(id);

  if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
    let data = JSON.parse(jsonData.innerHTML);
    if (data[key]) {
      return data[key];
    }
  }
  return {};
}
