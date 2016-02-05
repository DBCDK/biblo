'use strict';

/**
 * @file: Tests for groups container.
 */

import expect from 'expect';

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import GroupsContainer from '../GroupsContainer.component';

describe('GroupsContainer component tests', () => {
  it('should test groups container can render', () => {
    const render = TestUtils.createRenderer();
    render.render(<GroupsContainer />);

    const rendered = render.getRenderOutput();
    expect(JSON.stringify(rendered)).toContain('Velkommen til grupper!');
  });
});
