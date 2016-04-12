/**
 * @file
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';

import FooterContainer from '../FooterContainer.component.js';

describe('Test frontpage', () => {

  it('Assert className footer--container', () => {
    const render = TestUtils.createRenderer();
    render.render(<FooterContainer />);

    const rendered = render.getRenderOutput();

    const result = rendered.props.className;
    const expected = 'footer--container';
    assert.equal(result, expected, 'Found className footer--container');
  });
});
