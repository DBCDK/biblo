'use strict';

/**
 * @file: Tests for the group actions
 */

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

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

    const store = mockStore({}, expected, () => {done(); xhrMock.restore(); }); // eslint-disable-line brace-style
    store.dispatch(actions.asyncChangeImage(imageFile));
  });

  it('should test CHANGE_GROUP_IMAGE without file reader support', (done) => {
    xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
    // remove filereader support
    let _fileReader = window.FileReader;

    // test the action
    const imageFile = new Blob(['detteerenbilledfil'], {type: 'image/png'});
    let expected;

    // Delete is only possible on jsdom (e.g. not wallaby because it uses phantomjs), so if we can delete the property, we want to run the test.
    try {
      delete window.FileReader;

      expected = [{
        imageFile: imageFile,
        imageSrc: 'http://rubycycling.dk/wp-content/uploads/2016/01/Billede-kommer-snart_02.jpg',
        type: types.CHANGE_GROUP_IMAGE
      }];
    }
    catch (e) { // eslint-disable-line no-catch-shadow
      expected = [{
        imageFile: imageFile,
        imageSrc: 'data:image/png;base64,ZGV0dGVlcmVuYmlsbGVkZmls',
        type: types.CHANGE_GROUP_IMAGE
      }];
    }

    mockStore({}, expected, () => {done(); xhrMock.restore(); }) // eslint-disable-line brace-style
      .dispatch(actions.asyncChangeImage(imageFile));

    // restore filereader support
    window.FileReader = _fileReader;
  });

  it('should create SUBMIT_CREATE_GROUP action', (done) => {
    xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
    const imageFile = new Blob(['detteerenbilledfil'], {type: 'image/png'});
    const name = 'dette er et gruppe navn';
    const description = 'dette er en gruppe beskrivelse';

    let expectedActions = [
      {
        groupDescription: description,
        groupImage: imageFile,
        groupName: name,
        status: 'OK',
        errors: [],
        type: types.SUBMIT_CREATE_GROUP
      }, {
        type: types.GROUP_FORM_IS_SUBMITTING
      }
    ];

    let expected = [(incomingAction) => {
      let err = true;
      expectedActions.forEach((expectedAction) => {
        if (JSON.stringify(expectedAction) === JSON.stringify(incomingAction)) {
          err = false;
        }
      });

      if (err) {
        throw Error('Expected to find incomingAction in array: ' + JSON.stringify(incomingAction));
      }
    }];

    xhrMock.onCreate = (xhr) => {
      setTimeout(() => xhr.respond(200, {'Content-Type': 'application/json'}, '{"status":"OK"}'), 10);
    };

    const store = mockStore({}, expected, () => {done(); xhrMock.restore(); }); // eslint-disable-line brace-style
    store.dispatch(actions.asyncSubmitGroupCreateForm(imageFile, name, description));

    expected = {
      groupDescription: description,
      groupImage: imageFile,
      groupName: name,
      status: 'UNAUTHORIZED',
      errors: [],
      type: types.SUBMIT_CREATE_GROUP
    };

    xhrMock.onCreate = (xhr) => {
      setTimeout(() => xhr.respond(403, {'Content-Type': 'application/json'}, '{"status":"UNAUTHORIZED"}'), 10);
    };

    mockStore({}, expected, () => {done(); xhrMock.restore(); }) // eslint-disable-line brace-style
      .dispatch(actions.asyncSubmitGroupCreateForm(imageFile, name, description));

  });

  it('should test SUBMIT_CREATE_GROUP without image', (done) => {
    xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
    const name = 'dette er et gruppe navn';
    const description = 'dette er en gruppe beskrivelse';

    let expectedActions = [
      {
        type: types.GROUP_FORM_IS_SUBMITTING
      }, {
        groupDescription: description,
        groupImage: null,
        groupName: name,
        status: 'OK',
        errors: [],
        type: types.SUBMIT_CREATE_GROUP
      }
    ];

    let expected = [(incomingAction) => {
      let err = true;
      expectedActions.forEach((expectedAction) => {
        if (JSON.stringify(expectedAction) === JSON.stringify(incomingAction)) {
          err = false;
        }
      });

      if (err) {
        throw Error('Expected to find incomingAction in array: ' + JSON.stringify(incomingAction));
      }
    }];

    xhrMock.onCreate = (xhr) => {
      setTimeout(() => xhr.respond(200, {'Content-Type': 'application/json'}, '{"status":"OK"}'), 10);
    };

    const store = mockStore({}, expected, () => {done(); xhrMock.restore(); }); // eslint-disable-line brace-style
    store.dispatch(actions.asyncSubmitGroupCreateForm(null, name, description));
  });
});
