/**
 * @file: Tests for Group Form.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import $ from 'teaspoon';

import GroupForm from '../GroupForm.component';

describe('Test Group Form component', () => {
  const noop = () => {};
  const eventMock = {target: {value: 'bob'}};

  it('Check component renders', () => {
    const imageSrc = 'dette er en billedekilde';

    const component = (
      <GroupForm
        changeColourAction={noop}
        changeImageAction={noop}
        errors={[]}
        groupImageSrc={imageSrc}
        submit={noop}
        submitProgress={1}
        checkIfGroupNameExistsAction={noop}
      />
    );

    const dm = TestUtils.renderIntoDocument(component);
    const dmn = ReactDOM.findDOMNode(dm);

    expect(dmn.innerHTML).toContain(imageSrc);
  });

  it('should trigger group name check asynchronously', (done) => {
    const checkGroupNameSpy = groupName => {
      expect(groupName).toEqual(eventMock.target.value);
      done();
    };

    const component = (
      <GroupForm
        changeColourAction={noop}
        changeImageAction={noop}
        errors={[]}
        groupImageSrc={''}
        submit={noop}
        submitProgress={1}
        checkIfGroupNameExistsAction={checkGroupNameSpy}
      />
    );

    // Render and type into the group name input field
    const $root = $(component).shallowRender();
    $root.find('.group-name--input-field').trigger('change', eventMock);
  });
});
