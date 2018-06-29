/**
 * @file
 * Unittesting methods in profileForm.component.test.js
 */

import React from 'react';
import {shallow, mount} from 'enzyme';
import ProfileDeleteModalContainer from '../ProfileDeleteContainer.component';
import ProfileDeleteModal from '../ProfileDeleteModal.component';
import {profileMock} from '../../../__mocks__/profile.mock';

describe('Testing ProfileDeleteModal.component.js', () => {
  it('Show modal form', () => {
    const wrapper = shallow(
      <ProfileDeleteModalContainer
        profile={profileMock}
        onDelete={jest.fn()}
      />
    );
    // Modal is closed
    expect(wrapper).toMatchSnapshot();

    // Open modal
    wrapper.setState({modalIsOpen: true});
    expect(wrapper).toMatchSnapshot();
  });
  it('Show modal deleting form', () => {
    const wrapper = shallow(
      <ProfileDeleteModal
        isDeleting={false}
        hasDeleteError={false}
        isDeleted={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();

    // Is deleting
    wrapper.setProps({isDeleting: true});
    expect(wrapper).toMatchSnapshot();
    // is Deleted
    wrapper.setProps({isDeleted: true, isDeleting: false});
    expect(wrapper).toMatchSnapshot();
    // Has errors
    wrapper.setProps({hasDeleteError: true, isDeleted: false});
    expect(wrapper).toMatchSnapshot();
  });
  it('submit delete action', () => {
    const onDelete = jest.fn();
    const wrapper = mount(
      <ProfileDeleteModal
        isDeleting={false}
        hasDeleteError={false}
        isDeleted={false}
        onClose={jest.fn()}
        onConfirm={onDelete}
      />
    );
    wrapper.find('button.rounded-button--danger').simulate('click');
    wrapper.find('button.rounded-button--danger').simulate('click');
    expect(onDelete.mock.calls[0][0]).toEqual({transferGroups: true});

    wrapper.find('#no-transfer').simulate('click');
    wrapper.find('button.rounded-button--danger').simulate('click');
    expect(onDelete.mock.calls[1][0]).toEqual({transferGroups: false});
  });
});
