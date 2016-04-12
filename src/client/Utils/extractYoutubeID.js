/**
 * @file Extracts the youtube video ID from a given string
 */

import {isEmpty} from 'lodash';
import youtubeIdGetter from 'youtube-link-to-id';

/**
 * Extracts the youtube video ID from the given string.
 * If an empty string is given or no IDs are found null is returned. Otherwise
 * an array of ids is returned.
 *
 * @param {String} str
 * @return {Array|null}
 */
export default function extractYoutubeID(str) {
  if (isEmpty(str)) {
    return null;
  }

  const ids = youtubeIdGetter.linkStringToIds(str);
  return !isEmpty(ids) ? ids : null;
}
