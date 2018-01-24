/**
 * @file
 * Unittesting methods in ReviewList.test.js
 */

import React from 'react';
import {shallow} from 'enzyme';
import ReviewList from './../ReviewList';
import {mock} from './ReviewList.mock';

describe('Unittesting ReviewList', () => {

  it('Render ReviewList as expected', () => {
    const tree = shallow(<ReviewList {...mock} />);
    expect(tree).toMatchSnapshot();
  });
});
