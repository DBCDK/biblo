/**
 * @file: Tests for Group Form.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import {mount} from 'enzyme';

import GroupForm from '../GroupForm.component';

describe('Test Group Form component', () => {
  const noop = () => {};
  const eventMock = {target: {value: 'bob'}};

  it('Check component renders', () => {
    const imageSrc = 'dette er en billedekilde';
    const moderation = 'this is for moderation links';
    const component = (
      <GroupForm
        changeColourAction={noop}
        changeImageAction={noop}
        errors={[]}
        groupImageSrc={imageSrc}
        submit={noop}
        submitProgress={1}
        checkIfGroupNameExistsAction={noop}
        moderation={moderation}
      />
    );

    const dm = TestUtils.renderIntoDocument(component);
    const dmn = ReactDOM.findDOMNode(dm);

    expect(dmn.innerHTML).toContain(imageSrc);
    expect(dmn.innerHTML).toContain(moderation);
  });

  it('should trigger group name check asynchronously', done => {
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
    const wrapper = mount(component);
    wrapper.find('.group-name--input-field').first().simulate('change', eventMock);
  });
});
