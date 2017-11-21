/**
 * @file: Tests for droppable image field.
 */

import {expect} from 'chai';

import React from 'react';
import {mount} from 'enzyme';

import DroppableImageField from '../DroppableImageField/DroppableImageField.component.js';

describe('Test droppable image field component', () => {
  it('Check component renders', () => {
    const expected = '<div class="droppable-image-field" id="droppableImageField"><label>' +
      '<div class="image-and-plus-button-container"><img src="/no_profile.png"><div class="droppable-image-overlay">' +
      '</div><span class="upload-plus-button--container" style="width: 16px; height: 16px; position: relative;"><' +
      'svg class="upload-plus-button" width="16" height="16"><use xlink:href="[object Object]"></use></svg>' +
      '<div class="icon--svg--click-overlay"></div></span></div>' +
      '<input type="file" accept="image/*" class="droppable-image-field--file-input" name="bob"></label>' +
      '<p id="drop-files-here-message">Smid din fil her.</p>' +
      '<p id="filereader-fallback-message">Din file vil blive oploadet når du trykker OK.</p>' +
      '<p id="wrong-filetype-message">Du kan kun uploade billeder i dette felt, prøv med en anden fil!</p></div>';

    const wrapper = mount(<DroppableImageField onFile={() => {}} fieldName={'bob'} />);

    expect(wrapper.html()).to.equal(expected);
  });
});
