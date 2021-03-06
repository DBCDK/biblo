/**
 * @file: Tests for backbutton.
 */

import {expect} from 'chai';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import BackButton from '../BackButton/BackButton.component.js';

describe('Test backbutton', () => {
  it('Check backbutton onclick calls window.history.back', () => {
    sinon.spy(window.history, 'back'); // eslint-disable-line

    let comp = TestUtils.renderIntoDocument(
      <div>
        <BackButton />
      </div>
    );
    TestUtils.Simulate.click(ReactDOM.findDOMNode(comp).children[0]);

    expect(window.history.back.callCount).to.equal(1);

    window.history.back.restore();
  });
});
