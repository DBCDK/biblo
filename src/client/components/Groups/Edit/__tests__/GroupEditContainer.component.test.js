/**
 * @file: Tests for Group Form.
 */

import React from 'react';
import sinon from 'sinon';
import $ from 'teaspoon';
import assert from 'assert';

import {GroupEditContainer} from '../GroupEditContainer.component';

describe('Test Group Edit Form component', () => {

  let $root;
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
    changeImageAction: null
  };

  const UIActions = {
    openModalWindow: sinon.spy(),
    closeModalWindow: sinon.spy()
  };

  const Group = {
    id: 9,
    errors: [],
    UI: {
      imageSrc: '/billede/7/small'
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
    $root = $(component).render();
    assert.equal($root.find('.group-form--moderation').length, 1);
    Profile.isModerator = false;
    $root = $(component).render();
    assert.equal($root.find('.group-form--moderation').length, 0);
  });

  it('Check modals are rendered', () => {
    Profile.isModerator = true;
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };
    $root = $(component).render();

    assert.equal($root.find('.group-moderation.delete').length, 1);
    assert.equal($root.find('.group-moderation--text')[0].innerText, 'Er du sikker på du vil slette gruppen:', 'Delete Group is rendered ');

    UI.modal.children = 'open';
    $root = $(component).render();
    assert.equal($root.find('.group-moderation.open').length, 1);
    assert.equal($root.find('.group-moderation--text')[0].innerText, 'Er du sikker på du vil åbne gruppen:', 'Delete Open is rendered ');

    UI.modal.children = 'close';
    $root = $(component).render();
    assert.equal($root.find('.group-moderation.close').length, 1);
    assert.equal($root.find('.group-moderation--text')[0].innerText, 'Er du sikker på du vil lukke gruppen:', 'Delete Open is rendered ');
  });

  it('Check moderation action is called', () => {
    Profile.isModerator = true;
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };

    // Call delete group action
    $root = $(component).render();
    let button = $root.find('.group-moderation--confirm');
    button.trigger('click');
    let call = Actions.asyncGroupDelete.getCall(0);
    assert.equal(call.args[0], 9);

    // Call open group action
    UI.modal.children = 'open';
    $root = $(component).render();
    button = $root.find('.group-moderation--confirm');
    button.trigger('click');
    call = Actions.asyncGroupToggleClose.getCall(0);
    assert.equal(call.args[0], 9);
    assert.equal(call.args[1], false);

    // Call close group action
    UI.modal.children = 'close';
    $root = $(component).render();
    button = $root.find('.group-moderation--confirm');
    button.trigger('click');
    call = Actions.asyncGroupToggleClose.getCall(1);
    assert.equal(call.args[0], 9);
    assert.equal(call.args[1], true);

  });

  it('should close modal', () => {
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };
    $root = $(component).render();
    let button = $root.find('.group-moderation--cancel');
    button.trigger('click');
    assert.equal(UIActions.closeModalWindow.called, true);
  });
  it('On success it should render text', () => {
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };
    Group.moderation.success = true;
    $root = $(component).render();
    assert.equal($root.find('.group-moderation--done h3')[0].innerHTML, 'Gruppen er slettet');
  });

  it('On Fail it should render text', () => {
    UI.modal = {
      isOpen: true,
      children: 'delete'
    };
    Group.moderation.success = false;
    Group.moderation.error = true;
    $root = $(component).render();
    assert.equal($root.find('.message.error')[0].innerHTML, 'Du kan ikke slette gruppen');
  });
});
