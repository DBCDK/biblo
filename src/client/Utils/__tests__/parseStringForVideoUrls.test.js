/**
 * @file Testing the extractYoutubeID.js
 */

import {expect} from 'chai';
import {parseStringForVideoUrls} from '../parseStringForVideoUrls';

describe('Testing the parseStringForVideoUrls.js util', () => {
  it('it should return empty array when an empty string is given', () => {
    const result = parseStringForVideoUrls('', false);
    expect(Array.isArray(result)).to.be.true;
    expect(result).to.be.empty;
  });

  it('it should return null when no video URLs is found', () => {
    const result = parseStringForVideoUrls(
      'this is a string without any YouTube IDs',
      false
    );
    expect(Array.isArray(result)).to.be.true;
    expect(result).to.be.empty;
  });

  it('it should return an array with youtube url present', () => {
    const youtubeURL = 'https://www.youtube.com/watch?v=kNTnrpL1Uw0';
    const result = parseStringForVideoUrls(
      `this is a string containing one youtube link ${youtubeURL}`,
      false
    );

    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.deep.equal([
      'https://www.youtube.com/watch?v=kNTnrpL1Uw0',
      'https:',
      'www.',
      'youtube.com',
      'be.com',
      'watch?v=',
      'kNTnrpL1Uw0',
      // eslint-disable-next-line
      undefined
    ]);
  });

  it('it should return an array with two video urls present', () => {
    const youtubeURL = 'https://www.youtube.com/watch?v=kNTnrpL1Uw0';
    const vimeoURL = 'https://vimeo.com/76839641';
    const result = parseStringForVideoUrls(
      `this is a string containing one youtube link ${youtubeURL} and a vimeo link ${vimeoURL}`,
      false
    );

    expect(result).to.have.lengthOf(2);
    expect(result[0]).to.deep.equal([
      'https://www.youtube.com/watch?v=kNTnrpL1Uw0',
      'https:',
      'www.',
      'youtube.com',
      'be.com',
      'watch?v=',
      'kNTnrpL1Uw0',
      // eslint-disable-next-line
      undefined
    ]);
    expect(result[1]).to.deep.equal([
      'https://vimeo.com/76839641',
      'https:',
      // eslint-disable-next-line
      undefined,
      'vimeo.com',
      // eslint-disable-next-line
      undefined,
      // eslint-disable-next-line
      undefined,
      '76839641',
      // eslint-disable-next-line
      undefined
    ]);
  });

  it('it should return an array with one player', () => {
    const vimeoURL = 'https://vimeo.com/76839641';
    const result = parseStringForVideoUrls(
      `this is a string containing a vimeo link ${vimeoURL}`,
      true
    );
    const expectedSerializedVideoPlayer = `{"key":"${vimeoURL}","ref":null,"props":{"width":"100%","height":"100%","url":"${vimeoURL}","config":{"youtube":{"playerVars":{"controls":1}}},"playing":false,"loop":false,"controls":false,"volume":0.8,"muted":false,"playbackRate":1,"style":{},"progressInterval":1000,"playsinline":false,"wrapper":"div"},"_owner":null,"_store":{}}`; // eslint-disable-line

    expect(result).to.have.lengthOf(1);
    expect(JSON.stringify(result[0])).to.equal(expectedSerializedVideoPlayer);
  });
});
