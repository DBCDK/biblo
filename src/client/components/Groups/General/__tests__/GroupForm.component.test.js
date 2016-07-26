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

    const component = (
      <GroupForm
        changeColourAction={noop}
        changeImageAction={noop}
        errors={[]}
        groupImageSrc={imageSrc}
        submit={noop}
        submitProgress={1}
      />
    );

    const dm = TestUtils.renderIntoDocument(component);
    const dmn = ReactDOM.findDOMNode(dm);

    expect(dmn.innerHTML).toContain(imageSrc);
  });
});
