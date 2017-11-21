/**
 * @file
 */

import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';

import FooterContainer from '../FooterContainer.component.js';

describe('Test Footer', () => {

  it('Assert className footer--container', () => {
    const wrapper = shallow(<FooterContainer globalState={{}}/>);
    expect(wrapper.find('.footer--container')).to.have.length(1);
  });

  it('Assert menu is added', () => {
    const globalState = {
      menu: {
        main: [{
          title: 'Grupper',
          url: '/grupper',
          id: 1
        }],
        footer: [{
          title: 'Help',
          url: '/help',
          id: 2
        }]
      }
    };

    const wrapper = mount(<FooterContainer globalState={globalState}/>);
    expect(wrapper.find('.footer--main-menu .navbar--link').text()).to.equal(globalState.menu.main[0].title);
    expect(wrapper.find('.footer--sub-menu .navbar--link').text()).to.equal(globalState.menu.footer[0].title);
  });
});
