'use strict';

/**
 * @file
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';

import FrontpageContainer from '../FrontpageContainer.component';

describe('Test frontpage', () => {

  it('Assert Funkys Venner is present on frontpage', () => {
    const render = TestUtils.createRenderer();
    render.render(<FrontpageContainer />);

    const rendered = render.getRenderOutput();

    const result = rendered.props.children;
    const expected = 'Funkys Venner';
    assert.equal(result, expected, 'Found Funkys Venner as expected');
  });
});
