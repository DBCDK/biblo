/**
 * @file
 * Unittesting methods in GroupViewHeader
 */

import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';

import {GroupViewHeader} from './../GroupViewHeader.component';

describe('Testing the GroupViewHeader component', () => {
  it('Should render two children', () => {
    const wrapper = shallow(<GroupViewHeader groupId={1} uri={'some-url'} />);
    expect(wrapper.find('.group-header').children()).to.have.lengthOf(2);
  });

  it('First child should be a background image', () => {
    const wrapper = shallow(<GroupViewHeader groupId={1} uri={'some-url'} />);

    expect(wrapper.find('.group-header').childAt(0).type()).to.equal('div');
    expect(wrapper.find('.group-header').childAt(0).prop('className')).to.equal('group-header--background-image');
    expect(wrapper.find('.group-header').childAt(0).prop('style')).to.deep.equal({backgroundImage: 'url("some-url")'});
  });

  it('Second child should be a foreground image rendered in a href', () => {
    const groupId = 1;
    const wrapper = shallow(<GroupViewHeader groupId={groupId} uri={'some-url'} />);

    expect(wrapper.find('.group-header').childAt(1).type()).to.equal('div');
    expect(wrapper.find('.group-header').childAt(1).prop('className')).to.equal('group-header--foreground-image');
    expect(wrapper.find('.group-header').childAt(1).childAt(0).type()).to.equal('a');
    expect(wrapper.find('.group-header').childAt(1).childAt(0).prop('href')).to.equal(`/grupper/${groupId}`);
  });
});
