/**
 * @file Extracts the youtube video ID from a given string
 */

import React from 'react';
import {isEmpty} from 'lodash';
import youtubeIdGetter from 'youtube-link-to-id';
import ReactPlayer from 'react-player';

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

/**
 * Extracts youtube and vimeo URLs from the given string and return the matches. If returnPlayer is true a player based
 * on react-player will beturned.
 *
 * @param {string} str The string that should be regex'ed for youtube/vimeo urls
 * @param {boolean} returnPlayer If true a player based on react-player will be returned otherwise the raw regex
 *   matches is returned
 * @return {Array} List of result. If no results an empty array is returned.
 */
export function parseStringForVideoUrls(str, returnPlayer) {
  const regex = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|channels\/(?:\w+\/)|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/g; // eslint-disable-line
  const matches = [];

  let match = regex.exec(str);
  while (match !== null) {
    if (returnPlayer) {
      matches.push(
        <ReactPlayer
          width={'100%'}
          height={'100%'}
          url={match[0]}
          config={
            {
              youtube: {
                playerVars: {
                  controls: 1
                }
              }
            }
          }
        />);
    }
    else {
      matches.push(match);
    }
    match = regex.exec(str);
  }

  return matches;
}
