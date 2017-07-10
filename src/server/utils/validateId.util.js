/**
 * @file
 * Methods for extracting id from filename og urls and validating id as pid, faust or isbn.
 */

/**
 * Validate string as id.
 *
 * @param id
 * @returns {*}
 */
export function validateId(id) {
  if (isPid(id)) { // eslint-disable-line no-use-before-define
    return {type: 'pid', id: id};
  }
  else if (isIsbn(id)) { // eslint-disable-line no-use-before-define
    return {type: 'isbn', id: id};
  }
  else if (isFaust(id)) { // eslint-disable-line no-use-before-define
    return {type: 'faust', id: id};
  }
  return {type: 'error', id: id};
}

/**
 * Get id from url.
 *
 * @param url
 * @returns {{type, id}}
 */
export function getIdFromUrl(url) {
  return getIdFromFilename(url.split('/').pop()); // eslint-disable-line no-use-before-define
}

/**
 * Get id from filename.
 *
 * @param filename
 * @returns {{type, id}}
 */
export function getIdFromFilename(filename) {
  const id = filename.split('.')[0];
  return validateId(id);
}

/**
 * Split elements in pid
 * @param pid
 * @returns {{localIdentifier: T, libraryId: *}}
 */
export function splitPid(pid) {
  const localIdentifier = pid.split(':').pop();
  const libraryId = pid.split('-')[0];
  const source = pid.split('-')[1].split(':')[0];
  return {localIdentifier, source, libraryId};
}

/**
 * Test if string is pid id.
 *
 * @param id
 * @returns {boolean}
 */
function isPid(id) {
  return /.+-.+:.+/.test(id);
}

/**
 * Test if string is isbn id.
 *
 * @param id
 * @returns {boolean}
 */
function isIsbn(id) {
  const isbn = id.replace(/-/g, '');
  if (isbn.length === 10 || isbn.length === 13) {
    if (/^x?[0-9]*x?$/.test(isbn)) {
      return true;
    }
  }

  return false;
}

/**
 * Test if string is faust id.
 * @param id
 * @returns {boolean}
 */
function isFaust(id) {
  return id.length >= 8 && id.length <= 9 && Number(id) > 0;
}
