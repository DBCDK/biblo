/**
 * @file: Tests for droppable image field.
 */

import {expect} from 'chai';

import React from 'react';
import {mount} from 'enzyme';

import DroppableImageField from '../DroppableImageField/DroppableImageField.component.js';

describe('Test droppable image field component', () => {
  it('Check component renders', () => {
    const expected = '<input type="file" accept="image/*" class="droppable-image-field--file-input" name="bob">';

    const wrapper = mount(<DroppableImageField onFile={() => {}} fieldName={'bob'} />);
    expect(wrapper.find('.droppable-image-field--file-input').first().html()).to.equal(expected);
  });
});
