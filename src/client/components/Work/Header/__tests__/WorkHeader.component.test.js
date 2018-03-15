/**
 * @file
 * Unittesting methods in WorkHeader.component.test.js
 */

import React from 'react';
import {shallow} from 'enzyme';

import {WorkHeader} from './../WorkHeader.component';

describe('Testing the WorkHeader.component', () => {
  it('Matches snapshot when no link is provided', () => {
    const wrapper = shallow(<WorkHeader coverUrl={''} linkToMaterial={''} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Matches snapshot when a link is provided', () => {
    const wrapper = shallow(<WorkHeader coverUrl={''} linkToMaterial={'/some/link'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
