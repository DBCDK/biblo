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
        }]
      }
    };
    const component = $(<FooterContainer globalState={globalState}/>).render();
    const menuItems = component.find('.navbar--link');
    assert.equal(menuItems[0].innerHTML, globalState.menu.main[0].title, 'Found menu item');
  });
});
