/**
 * @file: Tests for the group actions
 */

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import expect from 'expect';

import * as actions from '../group.actions';
import * as types from '../../Constants/action.constants';

const mockStore = configureMockStore([thunk]);

describe('test group actions', () => {
  let xhrMock;

  it('should create CHANGE_GROUP_IMAGE action', (done) => {
    xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
    const imageFile = new Blob(['detteerenbilledfil'], {type: 'image/png'});

    const expected = [{
      imageFile: imageFile,
      imageSrc: 'data:image/png;base64,ZGV0dGVlcmVuYmlsbGVkZmls',
      type: types.CHANGE_GROUP_IMAGE
    }];

    const store = mockStore({}); // set initial state
    store.dispatch(actions.asyncChangeImage(imageFile))
      .then(() => {
        expect(store.getActions()).toEqual(expected);
        xhrMock.restore();
        done();
      });
  });

  it('should test CHANGE_GROUP_IMAGE without file reader support', (done) => {
    xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
    // remove filereader support
    const _fileReader = window.FileReader;

    // test the action
    const imageFile = new Blob(['detteerenbilledfil'], {type: 'image/png'});
    let expected;

    // Delete is only possible on jsdom (e.g. not wallaby because it uses phantomjs), so if we can delete the property, we want to run the test.
    try {
      delete window.FileReader;

      expected = {
        type: types.CHANGE_GROUP_IMAGE,
        imageSrc: '/Billede-kommer-snart.jpg',
        imageFile: imageFile
      };
    }
    catch (e) { // eslint-disable-line no-catch-shadow
      expected = {
        imageFile: imageFile,
        imageSrc: 'data:image/png;base64,ZGV0dGVlcmVuYmlsbGVkZmls',
        type: types.CHANGE_GROUP_IMAGE
      };
    }

    const store = mockStore({});
    return store.dispatch(actions.asyncChangeImage(imageFile))
      .then(() => {
        expect(store.getActions()[0]).toEqual(expected);
        xhrMock.restore();
        // restore filereader support
        window.FileReader = _fileReader;
        done();
      })
      .catch(() => {
        console.error('Promise was rejected');
      });
  });
});
