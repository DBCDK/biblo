/**
 * @file: Tests for roundedbutton submit.
 */

import {expect} from 'chai';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import RoundedButtonSubmit from '../RoundedButton/RoundedButton.submit.component.js';

describe('Test rounded button', () => {
  it('Check rounded submit button onclick calls clickFunction', () => {
    let callback = sinon.spy(); // eslint-disable-line

    let comp = TestUtils.renderIntoDocument(
      <div>
        <RoundedButtonSubmit buttonText={'bob'} clickFunction={callback} />
      </div>
    );
    TestUtils.Simulate.click(ReactDOM.findDOMNode(comp).children[0]);

    expect(callback.callCount).to.equal(1);
  });

  it('should test buttontext is rendered', () => {
    let comp = TestUtils.renderIntoDocument(
      <div>
        <RoundedButtonSubmit buttonText={'bob'} />
      </div>
    );
    expect(ReactDOM.findDOMNode(comp).children[0].value).to.equal('bob');
  });
});
