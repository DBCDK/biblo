'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../../Layout/PageLayout.component.js';
import Follow from '../../General/Follow/Follow.component.js';
import GroupHeader from './GroupViewHeader.component.js';
import GroupMembersBox from './GroupViewMembersBox.component.js';
import PostList from '../Posts/PostList.component.js';
import PostAdd from '../AddContent/AddContent.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component.js';

import * as groupActions from '../../../Actions/group.actions.js';
import * as uiActions from '../../../Actions/ui.actions.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';
import './scss/group-view.scss';

export class GroupViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      following: props.group.isFollowing,
      showloginToFollowMessage: false
    };

    this.toggleFollow = this.toggleFollow.bind(this);
    this.toggleMembersExpanded = this.toggleMembersExpanded.bind(this);

  }

  toggleFollow() {
    if (this.props.profile.userIsLoggedIn) {
      this.props.groupActions.asyncGroupFollow(!this.state.following, this.props.group.id, this.props.profile.id);
      this.setState({
        following: !this.state.following
      });
    }
    else {
      this.setState({showloginToFollowMessage: true});
    }
  }

  toggleMembersExpanded() {
    this.props.groupActions.asyncGroupMembersExpand(!this.props.group.isMembersExpanded, this.props.group.id);
  }

  render() {
    if (this.props.group.error) {
      return (
        <PageLayout>
          <div className="error">{this.props.group.error}</div>
        </PageLayout>
      );
    }

    const modal = (this.props.ui.modal.isOpen) ? <ModalWindow onClose={() => {this.props.uiActions.closeModalWindow()}}>{this.props.ui.modal.children}</ModalWindow> : null; // eslint-disable-line

    return (
      <PageLayout>
        {modal}
        <div className='group'>
          <GroupHeader uri={this.props.group.image || ''}/>

          <div className='group--content'>
            <div className="details">
              <h2 className='group--title'>{this.props.group.name}</h2>
              <p className='group--description'>{this.props.group.description}</p>

              <div className='group--follow'>
                <Follow active={this.state.following}
                        onClick={this.toggleFollow}
                        showLoginLink={this.state.showloginToFollowMessage}
                        text={this.state.following && 'Følger' || 'Følg gruppen'}/>
              </div>
            </div>
            <div className='group--post-add'>
              <h2>Skriv i gruppen</h2>
              <PostAdd redirectTo={`/grupper/${this.props.group.id}`} profile={this.props.profile}
                       parentId={this.props.group.id} type="post"/>
            </div>
            <div className='group--post-view'>
              <h2>{this.props.group.postsCount} {this.props.group.postsCount === 1 && 'bruger skriver' || 'brugere skriver'}</h2>
              <PostList posts={this.props.group.posts} profile={this.props.profile} groupId={this.props.group.id}
                        groupActions={this.props.groupActions} uiActions={this.props.uiActions}/>
              {this.props.group.postsCount > this.props.group.numberOfPostsLoaded &&
              <ExpandButton isLoading={this.props.group.loadingPosts}
                            onClick={() => this.props.groupActions.asyncShowMorePosts(this.props.group.id, this.props.group.numberOfPostsLoaded, 10)}
                            text="Vis flere"/>
              }
            </div>
          </div>
          <GroupMembersBox
            members={this.props.group.members}
            owner={this.props.group.owner}
            onExpand={this.toggleMembersExpanded}
            isExpanded={this.props.group.isMembersExpanded}
            isLoadingMembers={this.props.group.isLoadingMembers}
            />
        </div>
      </PageLayout>
    );
  }
}

GroupViewContainer.propTypes = {
  id: React.PropTypes.number,
  profile: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  groupActions: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  ui: React.PropTypes.object
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profile: state.profileReducer,
      group: state.groupViewReducer,
      ui: state.uiReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => { // eslint-disable-line no-unused-vars
    return {
      groupActions: bindActionCreators(groupActions, dispatch),
      uiActions: bindActionCreators(uiActions, dispatch)
    };
  }
)(GroupViewContainer);
