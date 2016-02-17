'use strict';

/**
 * @file: Tests for the group actions
 */

import expect from 'expect';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as actions from '../group.actions';
import * as types from '../../Constants/action.constants';

const mockStore = configureMockStore([thunk]);

describe('test group actions', () => {
  let xhrMock;

  beforeEach(() => {
    xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
  });

  afterEach(() => {
    xhrMock.restore();
  });

  it('should create CHANGE_GROUP_IMAGE action', (done) => {
    const imageFile = new Blob(['detteerenbilledfil'], {type: 'image/png'});

    const expected = [{
      imageFile: imageFile,
      imageSrc: 'data:image/png;base64,ZGV0dGVlcmVuYmlsbGVkZmls',
      type: types.CHANGE_GROUP_IMAGE
    }];

    const store = mockStore({}, expected, done);
    store.dispatch(actions.asyncChangeImage(imageFile));
  });

  it('should test CHANGE_GROUP_IMAGE without file reader support', (done) => {
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
    catch (e) {
      expected = [{
        imageFile: imageFile,
        imageSrc: 'data:image/png;base64,ZGV0dGVlcmVuYmlsbGVkZmls',
        type: types.CHANGE_GROUP_IMAGE
      }];
    }

    const store = mockStore({}, expected, done);
    store.dispatch(actions.asyncChangeImage(imageFile));

    // restore filereader support
    window.FileReader = _fileReader;
  });

  it('should create SUBMIT_CREATE_GROUP action', (done) => {
    const imageFile = new Blob(['detteerenbilledfil'], {type: 'image/png'});
    const name = 'dette er et gruppe navn';
    const description = 'dette er en gruppe beskrivelse';
    const colour = 'dette er en gruppe farve';

    let expected = {
      groupColour: colour,
      groupDescription: description,
      groupImage: imageFile,
      groupName: name,
      status: 'OK',
      errors: [],
      type: types.SUBMIT_CREATE_GROUP
    };

    xhrMock.onCreate = (xhr) => {
      setTimeout(() => xhr.respond(200, {'Content-Type': 'application/json'}, '{"status":"OK"}'), 10);
    };

    const store = mockStore({}, expected, done);
    store.dispatch(actions.asyncSubmitGroupCreateForm(imageFile, name, description, colour));

    expected = {
      groupColour: colour,
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

    mockStore({}, expected, done)
      .dispatch(actions.asyncSubmitGroupCreateForm(imageFile, name, description, colour));
  });

  it('should test SUBMIT_CREATE_GROUP without image', (done) => {
    const name = 'dette er et gruppe navn';
    const description = 'dette er en gruppe beskrivelse';
    const colour = 'dette er en gruppe farve';

    let expected = {
      groupColour: colour,
      groupDescription: description,
      groupImage: null,
      groupName: name,
      status: 'OK',
      errors: [],
      type: types.SUBMIT_CREATE_GROUP
    };

    xhrMock.onCreate = (xhr) => {
      setTimeout(() => xhr.respond(200, {'Content-Type': 'application/json'}, '{"status":"OK"}'), 10);
    };

    const store = mockStore({}, expected, done);
    store.dispatch(actions.asyncSubmitGroupCreateForm(null, name, description, colour));
  });

  it('should create CHANGE_GROUP_COLOUR action', () => {
    const colour = 'dette er en farve';
    const colourEventMock = {
      target: {
        value: colour
      }
    };

    const expected = {
      type: types.CHANGE_GROUP_COLOUR,
      colour
    };

    expect(actions.changeGroupColour(colourEventMock)).toEqual(expected);
  });
});
