import {expect} from 'chai';

import TimeToString from '../timeToString';

describe('Test TimeToString util', () => {
  it('it should return correct string', () => {
    expect(TimeToString(new Date(Date.now()))).to.be.equal('Lige nu');
    expect(TimeToString(new Date(Date.now() - 30 * 1000))).to.be.equal('Lige nu');
    expect(TimeToString(new Date(Date.now() - 60 * 1000))).to.be.equal('1 minut siden');
    expect(TimeToString(new Date(Date.now() - 2 * 60 * 1000))).to.be.equal('2 minutter siden');
    expect(TimeToString(new Date(Date.now() - 60 * 60 * 1000))).to.be.equal('1 time siden');
    expect(TimeToString(new Date(Date.now() - 2 * 60 * 60 * 1000))).to.be.equal('2 timer siden');
    expect(TimeToString(new Date(Date.now() - 24 * 60 * 60 * 1000))).to.be.equal('1 dag siden');
    expect(TimeToString(new Date(Date.now() - 2* 24 * 60 * 60 * 1000))).to.be.equal('2 dage siden');
  });
});
