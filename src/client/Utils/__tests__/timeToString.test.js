import {expect} from 'chai';
import moment from 'moment';

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
    expect(TimeToString(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))).to.be.equal('2 dage siden');
    expect(TimeToString(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000))).to.be.equal('15 dage siden');

    const sixteenDaysAgo = new Date(Date.now() - 16 * 24 * 60 * 60 * 1000);
    moment.locale('da');
    const expected = moment(sixteenDaysAgo).format('LL');
    expect(TimeToString(sixteenDaysAgo)).to.be.equal(expected);

    const pastDate = '2016-03-15T11:53:35.000Z';
    expect(TimeToString(pastDate)).to.be.equal('15. marts 2016');
  });
});
