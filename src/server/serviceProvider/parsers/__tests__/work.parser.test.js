/**
 * @file
 * Unittest methods in work.parser.js
 */

import {assert} from 'chai';
import parseWork from '../work.parser';

describe('Unittest methods in work.parser.js', () => {
  it('Should return default types', () => {
    const work = {};
    const result = parseWork(work);

    const resultKeys = Object.keys(result);

    resultKeys.forEach((key) => {
      const item = result[key];
      switch (key) {
        case 'workType': {
          assert.equal(item, 'other');
          break;
        }
        case 'coverUrl': {
          assert.equal(item, '/images/covers/other.png');
          break;
        }
        case 'director':
        case 'actors':
        case 'publisher':
        case 'ageRecommended':
        case 'ageAllowed': {
          assert.isNull(item);
          break;
        }
        default: {
          assert.equal(item, '');
          break;
        }
      }
    });
  });

  it('Should return first element from dcTtitle', () => {
    const work = {
      dcTitle: ['DC TITLE 1', 'DC TITLE 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.dcTitle, work.dcTitle[0]);
  });

  it('Should return first element from dcTitleFull', () => {
    const work = {
      dcTitleFull: ['DC TITLE FULL 1', 'DC TITLE FULL 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.dcTitleFull, work.dcTitleFull[0]);
  });

  it('Should return first element from abstract', () => {
    const work = {
      abstract: ['ABSTRACT 1', 'ABSTRACT 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.abstract, work.abstract[0]);
  });

  it('Should return first element from workType', () => {
    const work = {
      workType: ['WORKTYPE 1', 'WORKTYPE 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.workType, work.workType[0]);
  });

  it('Should return first element from coverUrlFull', () => {
    const work = {
      coverUrlFull: ['COVERURL_1', 'COVERURL_2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.coverUrl, `https:${work.coverUrlFull[0]}`);
  });

  it('Should return first element from extent', () => {
    const work = {
      extent: ['EXTENT 1', 'EXTENT 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.extent, work.extent[0]);
  });

  it('Should return first element from subjectDK5', () => {
    const work = {
      subjectDK5: ['DK5 1', 'DK5 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.subjectDK5, work.subjectDK5[0]);
  });

  it('Should return first element from subjectDK5Text', () => {
    const work = {
      subjectDK5Text: ['DK5 1', 'DK5 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.subjectDK5Text, work.subjectDK5Text[0]);
  });

  it('Should return first element from creatorDrt', () => {
    const work = {
      creatorDrt: ['CREATOR 1', 'CREATOR 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.director, work.creatorDrt[0]);
  });

  it('Should return all elements from contributorAct', () => {
    const work = {
      contributorAct: ['ACTOR 1', 'ACTOR 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.deepEqual(result.actors, work.contributorAct);
  });

  it('Should return first element from publisher', () => {
    const work = {
      publisher: ['PUBLISHER 1', 'PUBLISHER 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.publisher, work.publisher[0]);
  });

  it('Should return all elements from audienceAge', () => {
    const work = {
      audienceAge: ['AUDIENCE 1', 'AUDIENCE 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.deepEqual(result.ageRecommended, work.audienceAge);
  });

  it('Should return first element from audienceMedieraad', () => {
    const work = {
      audienceMedieraad: ['AGE 1', 'AGE 2']
    };
    const result = parseWork(Object.assign({}, work));
    assert.equal(result.ageAllowed, work.audienceMedieraad[0]);
  });
});
