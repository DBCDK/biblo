/**
 * @file
 * Unittesting methods in WorkHeader.component.test.js
 */

import React from 'react';
import {shallow} from 'enzyme';

import {WorkHeader} from './../WorkHeader.component';

describe('Testing the WorkHeader.component', () => {
  it('Matches the snapshot', () => {
    const wrapper = shallow(<WorkHeader coverUrl={''} linkToMaterial={''} />);
    expect(wrapper).toMatchSnapshot();
  });
});
