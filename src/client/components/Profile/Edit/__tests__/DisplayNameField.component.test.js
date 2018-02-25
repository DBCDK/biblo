/**
 * @file
 * Unittesting methods in DisplayNameField.component.test.js
 */

import React from 'react';
import {shallow} from 'enzyme';

import DisplayNameField from './../DisplayNameField.component';

describe('Unittesting DisplayNameField.component.test.js', () => {

  it('Given input should be sanitized prior to calling checkDisplayNameFunction', done => {
    const inputValue = '<script>console.log("test");</script>test';
    const expected = 'test';
    const checkDisplayNameFunction = jest.fn();
    const onChangeFunc = jest.fn();
    const wrapper = shallow(
      <DisplayNameField
        errors={{}}
        value={''}
        displayNameExists={false}
        checkDisplayNameFunction={checkDisplayNameFunction}
        onChangeFunc={onChangeFunc}
      />
    );

    const input = wrapper.find('input');
    input.simulate('keydown', {which: 'a'});
    input.simulate('change', {target: {value: inputValue}});

    setTimeout(() => {
      const sanitizedInput = checkDisplayNameFunction.mock.calls[0][0];
      expect(sanitizedInput).toEqual(expected);
      done();
    }, 1000);
  });
});
