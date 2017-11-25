/**
 * @file: Tests for ColourPicker Component.
 */

import {expect} from 'chai';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

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

    expect(dmn.innerHTML).to.include('base_colourPicker_name_colour');
    expect(dmn.innerHTML).to.include('blueish-green');
    expect(dmn.innerHTML).to.include('blue');
    expect(dmn.innerHTML).to.include('red');
    expect(dmn.innerHTML).to.include('light-purple');
    expect(dmn.innerHTML).to.include('light-blue');
    expect(dmn.innerHTML).to.include('yellow');
  });
});
