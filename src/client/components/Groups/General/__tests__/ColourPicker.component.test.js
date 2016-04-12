/**
 * @file: Tests for ColourPicker Component.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import ColourPicker from '../ColourPicker.component';

describe('Test ColourPicker', () => {
  it('Test colour picker component', () => {
    let comp = TestUtils.renderIntoDocument(
      <div>
        <ColourPicker
          baseName={'base_colourPicker_name'}
        />
      </div>
    );
    let dmn = ReactDOM.findDOMNode(comp).children[0];

    expect(dmn.innerHTML).toContain('base_colourPicker_name_colour');
    expect(dmn.innerHTML).toContain('blueish-green');
    expect(dmn.innerHTML).toContain('blue');
    expect(dmn.innerHTML).toContain('red');
    expect(dmn.innerHTML).toContain('light-purple');
    expect(dmn.innerHTML).toContain('light-blue');
    expect(dmn.innerHTML).toContain('yellow');
  });
});
