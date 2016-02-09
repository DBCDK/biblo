'use strict';

/**
 * @file: Tests for group create container.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {GroupCreateContainer} from '../GroupCreateContainer.component';

import groupReducer from '../../../../Reducers/group.reducer';

describe('Test group create container', () => {
  it('Test group create container can render', () => {
    const noop = () => {};

    // just get initial state
    let group = groupReducer(undefined, {}); // eslint-disable-line no-undefined

    // actions for this test (just use spies)
    let actions = {
      changeGroupColour: noop,
      asyncChangeImage: noop
    };

    let component = (
      <GroupCreateContainer
        group={group}
        actions={actions} />
    );
    let dm = TestUtils.renderIntoDocument(component);
    let dmn = ReactDOM.findDOMNode(dm);
    expect(dmn.innerHTML).toContain('Opret gruppe');
  });
});
