'use strict';

/**
 * @file
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';

import FrontpageContainer from '../FrontpageContainer.component';

describe('Test frontpage', () => {

  it('Assert Biblo is present on frontpage', () => {
    const render = TestUtils.createRenderer();
    render.render(<FrontpageContainer />);

    const rendered = render.getRenderOutput();

    const result = rendered.props.children[0].props.children;
    const expected = 'Biblo';
    assert.equal(result, expected, 'Found Biblo as expected');
  });
});
