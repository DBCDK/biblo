/**
 * @file
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';
import $ from 'teaspoon';

import FooterContainer from '../FooterContainer.component.js';

describe('Test Footer', () => {

  it('Assert className footer--container', () => {
    const render = TestUtils.createRenderer();
    render.render(<FooterContainer globalState={{}}/>);

    const rendered = render.getRenderOutput();

    const result = rendered.props.className;
    const expected = 'footer--container';
    assert.equal(result, expected, 'Found className footer--container');
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
    const component = $(<FooterContainer globalState={globalState}/>).render();
    const mainMenuItems = component.find('.footer--main-menu .navbar--link');
    assert.equal(mainMenuItems[0].innerHTML, globalState.menu.main[0].title, 'Found main menu item');

    const subMenuItems = component.find('.footer--sub-menu .navbar--link');
    assert.equal(subMenuItems[0].innerHTML, globalState.menu.footer[0].title, 'Found footer menu item');
  });
});
