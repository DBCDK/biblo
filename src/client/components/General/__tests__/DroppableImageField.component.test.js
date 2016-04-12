/**
 * @file: Tests for droppable image field.
 */

import expect from 'expect';

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import DroppableImageField from '../DroppableImageField/DroppableImageField.component.js';

describe('Test droppable image field component', () => {
  it('Check component renders', () => {
    const render = TestUtils.createRenderer();
    render.render(<DroppableImageField onFile={() => {}} fieldName={'bob'} />);

    const rendered = render.getRenderOutput();

    // Check it contains an input which only allows images.
    expect(rendered.props.children[0].props.children[1].type).toEqual('input');
    expect(rendered.props.children[0].props.children[1].props.accept).toEqual('image/*');
  });
});
