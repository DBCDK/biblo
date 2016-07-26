/**
 * @file: Tests for ColourPickerItem Component.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {ColourPickerItem} from '../ColourPickerItem.component';

describe('Test ColourPickerItem', () => {
  it('Test render', () => {
    const comp = TestUtils.renderIntoDocument(
      <div>
        <ColourPickerItem
          colourName={'this_is_a_colour'}
          inputName={'this_is_an_input'}
          onChangeFunction={() => {}}
          disabled={false}
        />
      </div>
    );
    let dmn = ReactDOM.findDOMNode(comp).children[0];

    expect(dmn.innerHTML).toContain('this_is_a_colour');
    expect(dmn.innerHTML).toContain('this_is_an_input');
  });
});
