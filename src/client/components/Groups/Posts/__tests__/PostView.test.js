'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import sd from 'skin-deep';

import * as uiActions from '../../../../Actions/ui.actions.js';
import PostView from '../PostView.component';
import AddContent from '../../AddContent/AddContent.component';

describe('Test of Comment Components', () => {

  const noop = () => {};

  // actions for this test (just use spies)
  let groupActions = {
    changeGroupColour: noop,
    asyncChangeImage: noop
  };

  const props = {
    id: 1,
    groupId: 1,
    content: 'test content',
    html: 'test content',
    image: 'some_url',
    timeCreated: (new Date()).toISOString(),
    owner: {
      displayName: 'testUser',
      image: 'some_profile_image'
    },
    profile: {
      userIsLoggedIn: true
    },
    uiActions: uiActions,
    groupActions: groupActions
  };

  it('it should show generate html', () => {
    const tree = sd.shallowRender(<PostView {...props} />);

    expect(tree.subTree('.post--profile-image').subTree('img').getRenderOutput().props.src).to.be.equal(props.owner.image);
    expect(tree.subTree('.post--profile-image').subTree('img').getRenderOutput().props.alt).to.be.equal(props.owner.displayName);
    expect(tree.subTree('.username').text()).to.be.equal(props.owner.displayName);
    expect(tree.subTree('.time').text()).to.be.equal('Lige nu');
    expect(tree.subTree('.post--content').props.dangerouslySetInnerHTML.__html).to.be.equal(props.html);
    expect(tree.subTree('.post--media').subTree('img').getRenderOutput().props.src).to.be.equal(props.image);
  });

  it('it should not show an image', () => {
    props.image = null;
    const tree = sd.shallowRender(<PostView {...props} />);
    expect(tree.subTree('.post--media')).to.be.equal(false);
  });

  describe('Test toggle Comment Input Component', () => {
    const component = TestUtils.renderIntoDocument(<PostView {...props} />);

    it('it should show comment-add-button before click', () => {
      expect(component.state.isCommentInputVisible).to.be.equal(false);
      const forms = TestUtils.scryRenderedComponentsWithType(component, AddContent);
      expect(forms.length).to.be.equal(0);
      TestUtils.findRenderedDOMComponentWithClass(component, 'post--add-comment-button');
    });
    it('it should show AddComment Component after click', () => {
      let button = TestUtils.findRenderedDOMComponentWithClass(component, 'post--add-comment-button');
      TestUtils.Simulate.click(button);
      expect(component.state.isCommentInputVisible).to.be.equal(true);
      button = TestUtils.scryRenderedDOMComponentsWithClass(component, 'post--add-comment-button');
      expect(button.length).to.be.equal(0);
      const addContent = TestUtils.findRenderedComponentWithType(component, AddContent);
      expect(addContent.props.redirectTo).to.be.equal('/grupper/1');
      expect(addContent.props.profile).to.be.equal(props.profile);
      expect(addContent.props.parentId).to.be.equal(props.id);
      expect(addContent.props.type).to.be.equal('comment');
      expect(addContent.props.abort).to.be.a('function');
    });

    xit('it should remove AddComment Component after click on abort button', () => {
      const addContent = TestUtils.findRenderedComponentWithType(component, AddContent);
      const input = TestUtils.findRenderedDOMComponentWithClass(addContent, 'alert');
      TestUtils.Simulate.click(input);
      expect(component.state.isCommentInputVisible).to.be.equal(false);
    });
  });


});
