/**
 * @file Testing the CookieWarningContainer component
 */

import React from 'react';
import {assert} from 'chai';
import sd from 'skin-deep';
import Cookies from 'js-cookie';

import CookieWarningContainer from '../CookieWarningContainer.component';

describe('Testing the CookieWarningContainer component', () => {

  it('Should render a modal', () => {
    Cookies.remove('reddi-fe-cookie');
    const tree = sd.shallowRender(<CookieWarningContainer />);
    assert.isNotFalse(tree.subTree('.cookie-warning'), 'A cookie warning was rendered');
  });

  it('Should hide the cookie warning', () => {
    const tree = sd.shallowRender(<CookieWarningContainer />);
    const instance = tree.getMountedInstance();
    assert.isTrue(instance.state.displayWarning);
    instance.onClose();
    assert.isFalse(instance.state.displayWarning, 'state.displayWarning is false after the onClose method was invoked');

    assert.isFalse(tree.subTree('.cookie-warning'), 'No cookie warning was found after the onClose method was invoked');
  });
});
