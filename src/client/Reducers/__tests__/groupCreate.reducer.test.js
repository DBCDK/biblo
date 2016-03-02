'use strict';

/**
 * @file: Tests for the group reducer
 */

import expect from 'expect';
import groupCreateReducer from '../groupCreate.reducer';
import * as types from '../../Constants/action.constants';
import assignToEmpty from '../../Utils/assign';

describe('Test GroupCreate reducer', () => {
  let initialState = { // initial state mock
    UI: {
      imageSrc: '/no_group_image.png',
      submitProgress: 0,
      submitState: null
    },
    colour: '',
    description: '',
    imageFile: null,
    name: '',
    errors: []
  };

  beforeEach(() => {
    initialState = { // initial state mock
      UI: {
        imageSrc: '/no_group_image.png',
        submitProgress: 0,
        submitState: null
      },
      colour: '',
      description: '',
      imageFile: null,
      name: '',
      errors: []
    };
  });

  it('should return initial state, given no state', () => {
    const action = {};

    expect(groupCreateReducer(undefined, action)).toEqual(initialState); // eslint-disable-line no-undefined
  });

  it('should test CHANGE_GROUP_IMAGE action', () => {
    const imageFile = new Blob(['detteerenbilledfil'], {type: 'image/png'});
    const imageSrc = 'dette er en billed kilde';

    const state = initialState;
    const action = {
      imageFile,
      imageSrc,
      type: types.CHANGE_GROUP_IMAGE
    };

    const expected = assignToEmpty(initialState, {
      imageFile: imageFile,
      UI: assignToEmpty(initialState.UI, {
        imageSrc: imageSrc
      })
    });

    expect(groupCreateReducer(state, action)).toEqual(expected);
  });

  it('should test SUBMIT_CREATE_GROUP action', () => {
    const name = 'dette er et gruppe navn';
    const description = 'dette er en gruppe beskrivelse';
    const colour = 'dette er en gruppe farve';
    const imageFile = new Blob(['dette er en billed fil'], {type: 'image/png'});

    const state = initialState;
    const action = {
      groupName: name,
      groupDescription: description,
      groupColour: colour,
      groupImage: imageFile,
      errors: [],
      type: types.SUBMIT_CREATE_GROUP
    };

    const expected = assignToEmpty(initialState, {
      name,
      description,
      colour,
      imageFile
    });

    expect(groupCreateReducer(state, action)).toEqual(expected);
  });

  it('should test CHANGE_GROUP_COLOUR action', () => {
    const colour = 'dette er en gruppe farve';
    const state = initialState;
    const action = {
      type: types.CHANGE_GROUP_COLOUR,
      colour
    };

    const expected = assignToEmpty(state, {
      colour
    });

    expect(groupCreateReducer(state, action)).toEqual(expected);
  });
});
