/**
 * @file
 * tests the click overlay component
 */

import React from 'react';
import {mount} from 'enzyme';
import {assert} from 'chai';

import ClickOverlay from '../ClickOverlay.Component.js';

describe('Test ClickOverlay Component', () => {
  it('Assert className navbar--container', done => {
    const event = sinon.spy(); // eslint-disable-line block-scoped-var, no-undef
    const wrapper = mount(<div><ClickOverlay active={true} onClick={event} /></div>);
    wrapper.children().at(0).simulate('click');

    setTimeout(() => {
      assert.isTrue(event.called);
      done();
    });
  });
});
