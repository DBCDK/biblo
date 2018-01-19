/**
 * @file Testing the CookieWarningContainer component
 */

import React from 'react';
import {shallow} from 'enzyme';
import Cookies from 'js-cookie';

import CookieWarningContainer from '../CookieWarningContainer.component';

describe('Testing the CookieWarningContainer component', () => {

  it('Should render a modal', () => {
    Cookies.remove('reddi-fe-cookie');
    const tree = shallow(<CookieWarningContainer />);

    expect(tree.find('.cookie-warning')).toHaveLength(1);
    expect(tree).toMatchSnapshot();
  });

  it('Should hide the cookie warning', () => {
    const tree = shallow(<CookieWarningContainer />);
    const instance = tree.instance();

    expect(instance.state.displayWarning).toBe(true);
    instance.onClose();
    tree.update();

    expect(instance.state.displayWarning).toBe(false);
    expect(tree.find('.cookie-warning')).toHaveLength(0);
  });
});
