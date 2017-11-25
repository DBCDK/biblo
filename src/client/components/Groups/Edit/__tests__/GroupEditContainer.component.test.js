/**
 * @file: Tests for Group Form.
 */

import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {expect} from 'chai';

import {GroupEditContainer} from '../GroupEditContainer.component';

describe('Test Group Edit Form component', () => {

  const Profile = {
    isModerator: true
  };

  const UI = {
    modal: {
      isOpen: false,
      title: null,
      children: null
    }
  };

  const Actions = {
    asyncGroupToggleClose: sinon.spy(),
    asyncGroupDelete: sinon.spy(),
    asyncShowGroups: () => {
    },
    changeImageAction: null,
    asyncChangeImage: () => {}
  };

  const UIActions = {
    openModalWindow: sinon.spy(),
    closeModalWindow: sinon.spy()
  };

  const Group = {
    id: 9,
    errors: [],
    UI: {
      imageSrc: '/billede/7/small',
      submitProgress: 0
    },
    raw: {
      name: 'hep'
    },
    moderation: {}
  };

  const component = (
    <GroupEditContainer
      searchState={{
        query: '',
        workSuggestions: {}
      }}
      globalState={{}}
      searchActions={{}}
      ui={UI}
      uiActions={UIActions}
      data={{}}
      actions={Actions}
      profileState={Profile}
      group={Group}
    />
  );

  it('Check Moderation Block is toggled by profile type', () => {
    Profile.isModerator = true;
    let wrapper = mount(component);
    expect(wrapper.find('.group-form--moderation')).to.have.lengthOf(1);

    Profile.isModerator = false;
    wrapper = mount(component);
    expect(wrapper.find('.group-form--moderation')).to.have.lengthOf(0);
  });

  it('Check modals are rendered', () => {
    Profile.isModerator = true;
    Group.moderation = {};
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };
    let wrapper = mount(component);

    expect(wrapper.find('.group-moderation.delete')).to.have.lengthOf(1);

    UI.modal.children = 'open';
    wrapper = mount(component);
    expect(wrapper.find('.group-moderation.open')).to.have.lengthOf(1);

    UI.modal.children = 'close';
    wrapper = mount(component);
    expect(wrapper.find('.group-moderation.close')).to.have.lengthOf(1);
  });

  it('Check moderation action is called', () => {
    Profile.isModerator = true;
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };

    // Call delete group action
    let wrapper = mount(component);
    let button = wrapper.find('.group-moderation--confirm').first();
    button.simulate('click');
    let call = Actions.asyncGroupDelete.getCall(0);
    expect(call.args[0]).to.equal(9);

    // Call open group action
    UI.modal.children = 'open';
    wrapper = mount(component);
    button = wrapper.find('.group-moderation--confirm').first();
    button.simulate('click');
    call = Actions.asyncGroupToggleClose.getCall(0);
    expect(call.args[0]).to.equal(9);
    expect(call.args[1]).to.equal(false);

    // Call close group action
    UI.modal.children = 'close';
    wrapper = mount(component);
    button = wrapper.find('.group-moderation--confirm').first();
    button.simulate('click');
    call = Actions.asyncGroupToggleClose.getCall(1);
    expect(call.args[0]).to.equal(9);
    expect(call.args[1]).to.equal(true);
  });

  it('should close modal', () => {
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };

    const wrapper = mount(component);
    let button = wrapper.find('.group-moderation--cancel').first();
    button.simulate('click');
    expect(UIActions.closeModalWindow.called).to.equal(true);
  });

  it('On success it should render text', () => {
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };
    Group.moderation.success = true;
    const wrapper = mount(component);
    expect(wrapper.find('.group-moderation--done h3').first().text()).to.equal('Gruppen er slettet');
  });

  it('On Fail it should render text', () => {
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };

    Group.moderation.success = false;
    Group.moderation.error = true;

    const wrapper = mount(component);
    expect(wrapper.find('.message.error').first().text()).to.equal('Du kan ikke slette gruppen');
  });
});
