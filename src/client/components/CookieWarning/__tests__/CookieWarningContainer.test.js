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

    expect(tree.find('.cookie-warning')).toHaveLength(1); // eslint-disable-line no-undef
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });

  it('Should hide the cookie warning', () => {
    const tree = shallow(<CookieWarningContainer />);
    const instance = tree.instance();

    expect(instance.state.displayWarning).toBe(true); // eslint-disable-line no-undef
    instance.onClose();
    tree.update();

    expect(instance.state.displayWarning).toBe(false); // eslint-disable-line no-undef
    expect(tree.find('.cookie-warning')).toHaveLength(0); // eslint-disable-line no-undef
  });
});
