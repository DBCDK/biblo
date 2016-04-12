/**
 * @file
 * tests the NavbarLink Component
 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';

import NavbarLink from '../NavbarLink.component.js';

describe('Test NavbarLink Component', () => {

  it('Assert className navbar--container', (done) => {
    const event = sinon.spy(); // eslint-disable-line block-scoped-var, no-undef
    let dom = TestUtils.renderIntoDocument(<div><NavbarLink url='someurl' value='some value' onClick={event} /></div>);
    let navbarLink = ReactDOM.findDOMNode(dom).children[0];
    TestUtils.Simulate.click(navbarLink);
    setTimeout(() => {
      assert.isTrue(event.called);
      done();
    });
  });
});
