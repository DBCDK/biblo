/**
 * @file
 * tests the click overlay component
 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';

import ClickOverlay from '../ClickOverlay.Component.js';

describe('Test ClickOverlay Component', () => {


  it('Assert className navbar--container', (done) => {
    const event = sinon.spy(); // eslint-disable-line block-scoped-var, no-undef
    let dom = TestUtils.renderIntoDocument(<div><ClickOverlay active={true} onClick={event} /></div>);
    let clickOverlay = ReactDOM.findDOMNode(dom).children[0];

    TestUtils.Simulate.click(clickOverlay);
    setTimeout(() => {
      assert.isTrue(event.called);
      done();
    });
  });
});
