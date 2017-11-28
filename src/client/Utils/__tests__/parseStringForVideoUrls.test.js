/**
 * @file Testing the extractYoutubeID.js
 */

import {expect} from 'chai';
import {parseStringForVideoUrls} from '../extractYoutubeID';

describe('Testing the parseStringForVideoUrls.js util', () => {
  it('it should return empty array when an empty string is given', () => {
    const result = parseStringForVideoUrls('', false);
    expect(Array.isArray(result)).to.be.true;
    expect(result).to.be.empty;
  });

  it('it should return null when no video URLs is found', () => {
    const result = parseStringForVideoUrls('this is a string without any YouTube IDs', false);
    expect(Array.isArray(result)).to.be.true;
    expect(result).to.be.empty;
  });

  it('it should return an array with youtube url present', () => {
    const youtubeURL = 'https://www.youtube.com/watch?v=kNTnrpL1Uw0';
    const result = parseStringForVideoUrls(`this is a string containing one youtube link ${youtubeURL}`, false);

    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.deep.equal(['https://www.youtube.com/watch?v=kNTnrpL1Uw0', 'https:', 'www.', 'youtube.com', 'be.com', 'watch?v=', 'kNTnrpL1Uw0', undefined]); // eslint-disable-line
  });

  it('it should return an array with two video urls present', () => {
    const youtubeURL = 'https://www.youtube.com/watch?v=kNTnrpL1Uw0';
    const vimeoURL = 'https://vimeo.com/76839641';
    const result = parseStringForVideoUrls(`this is a string containing one youtube link ${youtubeURL} and a vimeo link ${vimeoURL}`, false);

    expect(result).to.have.lengthOf(2);
    expect(result[0]).to.deep.equal(['https://www.youtube.com/watch?v=kNTnrpL1Uw0', 'https:', 'www.', 'youtube.com', 'be.com', 'watch?v=', 'kNTnrpL1Uw0', undefined]); // eslint-disable-line
    expect(result[1]).to.deep.equal(['https://vimeo.com/76839641', 'https:', undefined, 'vimeo.com', undefined, undefined, '76839641', undefined]); // eslint-disable-line
  });

  it('it should return an array with one player', () => {
    const vimeoURL = 'https://vimeo.com/76839641';
    const result = parseStringForVideoUrls(`this is a string containing a vimeo link ${vimeoURL}`, true);
    const expectedSerializedVideoPlayer = '{"key":null,"ref":null,"props":{"width":"100%","height":"100%","url":"https://vimeo.com/76839641","config":{"youtube":{"playerVars":{"controls":1}}},"playing":false,"loop":false,"controls":false,"volume":0.8,"muted":false,"playbackRate":1,"style":{},"progressFrequency":1000,"playsinline":false},"_owner":null,"_store":{}}'; // eslint-disable-line

    expect(result).to.have.lengthOf(1);
    expect(JSON.stringify(result[0])).to.equal(expectedSerializedVideoPlayer); // eslint-disable-line
  });
});
