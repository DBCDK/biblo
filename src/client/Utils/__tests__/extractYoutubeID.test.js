'use strict';

/**
 * @file Testing the extractYoutubeID.js
 */

import {assert} from 'chai';
import ExtractYoutubeID from '../extractYoutubeID';

describe('Testing the extractYoutubeID.js util', () => {
  it('it should return null when an empty string is given', () => {
    assert.isNull(ExtractYoutubeID(''));
  });

  it('it should return null when no Youtube IDs is found', () => {
    assert.isNull(ExtractYoutubeID('this is a string without any YouTube IDs'));
  });

  it('it should return an array with one id present', () => {
    const result = ExtractYoutubeID('this is a string containing one youtube link https://www.youtube.com/watch?v=kNTnrpL1Uw0');

    assert.isNotNull(result, 'Value is not null');
    assert.isArray(result, 'Got array');
    assert.lengthOf(result, 1, 'Array has length of one');
    assert.equal(result[0], 'kNTnrpL1Uw0', 'Array contains expected ID');
  });
});
