'use strict';

/**
 * @file
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';

import NavbarContainer from '../NavbarContainer.component.js';

describe('Test frontpage', () => {

  it('Assert className navbar--container', () => {
    const render = TestUtils.createRenderer();
    render.render(<NavbarContainer />);

    const rendered = render.getRenderOutput();

    const result = rendered.props.className;
    const expected = 'navbar--container';
    assert.equal(result, expected, 'Found className navbar--container');
  });
});
