/* eslint-disable */

import EntitySuggest from '../entitysuggest.client';
import sinon from 'sinon';
import request from 'request'

describe('Test methods in client.js', () => {
  beforeEach(function(done) {
    sinon
      .stub(request, 'get')
      .yields(null, {
        statusCode: 200,
      }, JSON.stringify({
        response: true
      }));
    done();
  });

  afterEach(function(done) {
    request.get.restore();
    done();
  });

  it('Test init method', () => {
    expect(EntitySuggest).not.toBeNull();

    const init = EntitySuggest;
    expect(typeof init === 'function').toBeTruthy();

    expect(init).toThrow(Error);

    let config = {};
    expect(() => init(config)).toThrow(Error);

    config = {endpoint: 'test', method: 'method'};
    expect(() => init(config)).not.toThrow(Error);

    const methods = init(config);
    expect(methods).toHaveProperty('getSubjectSuggestions');
    expect(methods).toHaveProperty('getCreatorSuggestions');
    expect(methods).toHaveProperty('getLibrarySuggestions');
  });

  it('Test getSubjectSuggestions Methods', (done) => {
    let suggest = EntitySuggest({
      method: 'entity-suggest',
      endpoint: 'http://xp-p02.dbc.dk/ms/entity-suggest/v1'
    });

    suggest.getSubjectSuggestions({query: 'display.title', rs: 5})
      .then((data) => {
        expect(request.get.calledWith({
          uri: 'http://xp-p02.dbc.dk/ms/entity-suggest/v1/subject',
          qs: {query: 'display.title', rs: 5, lt: 'folkebibliotek'}
        })).toBeTruthy();
        expect(request.get.calledOnce).toBeTruthy();
        expect(typeof data === 'object').toBeTruthy();
        expect(data).toHaveProperty('response');
        done();
      }).catch((err) => {
        done(err);
      }
    );
  });

  it('Test getCreatorSuggestions Methods', (done) => {
    let suggest = EntitySuggest({
      method: 'entity-suggest',
      endpoint: 'http://xp-p02.dbc.dk/ms/entity-suggest/v1'
    });

    suggest.getCreatorSuggestions({query: 'display.title', rs: 5})
      .then((data) => {
        expect(request.get.calledWith({
          uri: 'http://xp-p02.dbc.dk/ms/entity-suggest/v1/creator',
          qs: {query: 'display.title', rs: 5, lt: 'folkebibliotek'}
        })).toBeTruthy();
        expect(typeof data === 'object').toBeTruthy();
        expect(data).toHaveProperty('response');
        done();
      }).catch((err) => {
        done(err);
      }
    );
  });

  it('Test getLibrarySuggestions Methods', (done) => {
    let suggest = EntitySuggest({
      method: 'entity-suggest',
      endpoint: 'http://xp-p02.dbc.dk/ms/entity-suggest/v1'
    });

    suggest.getLibrarySuggestions({query: 'display.title', rs: 5, lt: 'testbibliotek'})
      .then((data) => {
        expect(request.get.calledWith({
          uri: 'http://xp-p02.dbc.dk/ms/entity-suggest/v1/library',
          qs: {query: 'display.title', rs: 5, lt: 'testbibliotek'}
        })).toBeTruthy();
        expect(typeof data === 'object').toBeTruthy();
        expect(data).toHaveProperty('response');
        done();
      }).catch((err) => {
        done(err);
      }
    );
  });
});
