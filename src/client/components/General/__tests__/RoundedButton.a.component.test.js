/**
 * @file: Tests for roundedbutton a.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import RoundedButton from '../RoundedButton/RoundedButton.a.component.js';

describe('Test rounded button', () => {
  it('Check rounded button onclick calls clickFunction', () => {
    let callback = sinon.spy(); // eslint-disable-line

    let comp = TestUtils.renderIntoDocument(<div><RoundedButton buttonText={'bob'} clickFunction={callback} /></div>);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(comp).children[0]);

    expect(callback.callCount).toEqual(1);
  });

  it('Should check buttontext is rendered', () => {
    let comp = TestUtils.renderIntoDocument(<div><RoundedButton buttonText={'bob'} /></div>);
    expect(ReactDOM.findDOMNode(comp).children[0].innerHTML).toEqual('bob');
  });
});
