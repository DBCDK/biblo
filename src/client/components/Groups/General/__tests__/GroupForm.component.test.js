/**
 * @file: Tests for Group Form.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import GroupForm from '../GroupForm.component';

describe('Test Group Form component', () => {
  it('Check component renders', () => {
    const noop = () => {};
    const imageSrc = 'dette er en billedekilde';

    let component = (
      <GroupForm
        changeColourAction={noop}
        changeImageAction={noop}
        errors={[]}
        groupImageSrc={imageSrc}
        submit={noop} />
    );
    let dm = TestUtils.renderIntoDocument(component);
    let dmn = ReactDOM.findDOMNode(dm);
    expect(dmn.innerHTML).toContain(imageSrc);
  });
});
