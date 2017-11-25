/**
 * @file
 * tests the NavbarLink Component
 */

import React from 'react';
import {mount} from 'enzyme';
import {assert} from 'chai';

import NavbarLink from '../NavbarLink.component.js';

describe('Test NavbarLink Component', () => {

  it('Assert className navbar--container', (done) => {
    const event = sinon.spy(); // eslint-disable-line block-scoped-var, no-undef
    const wrapper = mount(<div><NavbarLink url='someurl' value='some value' onClick={event} /></div>);
    const navbarLink = wrapper.children().first();

    navbarLink.simulate('click');
    setTimeout(() => {
      assert.isTrue(event.called);
      done();
    });
  });
});
