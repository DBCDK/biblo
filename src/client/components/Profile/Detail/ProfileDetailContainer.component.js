'use strict';

/* eslint-disable react/no-danger */

/**
 * @file: Dette er den offentlige profil.
 */

import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import assignToEmpty from '../../../Utils/assign';
import twemoji from 'twemoji';

import PageLayout from '../../Layout/PageLayout.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ActivityRow from './ActivityRow.component';
import PostView from '../../Groups/Posts/PostView.component';
import Icon from '../../General/Icon/Icon.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import Follow from '../../General/Follow/Follow.component';

import * as feedActions from '../../../Actions/feed.actions';
import * as flagActions from '../../../Actions/flag.actions';
import * as likeActions from '../../../Actions/like.actions';
import * as groupActions from '../../../Actions/group.actions';
import * as uiActions from '../../../Actions/ui.actions';

import grupperSvg from '../../General/Icon/svg/functions/group.svg';
import editSvg from '../../General/Icon/svg/functions/pencil.svg';

import {PROFILE_EDIT, MODERATOR_PROFILE_EDIT} from '../../../Constants/hyperlinks.constants';

import './ProfileDetailContainer.component.scss';

export class ProfileDetailContainer extends React.Component {

  constructor(props) {
    super(props);

    // sd466: allow unfollowed groups to stay on screen during session . Default to following = true on startup
    if (props.feed.profile.groups) {
      props.feed.profile.groups.map((group) => {
        group.following = true;
      });
    }

    this.state = {
      groups: props.feed.profile.groups
    };
  }

  toggleFollow(group, profileId, isMyProfile) {
    if (this.props.profile.userIsLoggedIn) {
      group.following = !group.following;
      this.props.groupActions.asyncGroupFollow(group.following, group.id, profileId);
      this.setState({groups: this.state.groups});
      this.props.uiActions.closeModalWindow();
      this.forceUpdate();
      this.props.uiActions.openModalWindow(this.renderModalContent(isMyProfile));
    }
  }

  renderModalContent(isMyProfile) {
    return (
      <div className="groups-modal--container">
        {this.state.groups.map((group) => {
          return (
            <span key={`group_${group.id}`} className="user-feed--groups-modal--group">
                <a href={'/grupper/' + group.id}>
                  <img
                    className="user-feed--groups-modal--group-image"
                    src={group.coverImage ? `/billede/${group.coverImage.id}/small-square` : '/no_group_image.png'}
                  />
                  <div className="user-feed--groups-modal--group-name"
                       dangerouslySetInnerHTML={{__html: twemoji.parse(group.name)}}/>
                </a>
              {isMyProfile ?
                <Follow active={group.following}
                        onClick={this.toggleFollow.bind(this, group, this.props.profile.id, isMyProfile)}
                        showLoginLink={false}
                        text={group.following && 'Følger' || 'Følg gruppen'}/> : ''}
                 </span>
          );
        })}
      </div>
    );
  }

  render() {
    let userProfile = this.props.feed.profile;
    userProfile = assignToEmpty(userProfile, {
      image: userProfile && userProfile.image && userProfile.image.medium || '/no_profile.png'
    });

    const isMyProfile = this.props.profile.id === this.props.feed.profile.id;

    let feed = this.props.feed.feed.map((activity) => {
      activity.owner = assignToEmpty({
        id: '',
        displayName: ''
      }, activity.owner);

      let displayName = activity.owner.displayName;

      if (isMyProfile) {
        displayName = 'Du';
      }
      switch (activity.type) {
        case 'comment':
          let title = displayName + ' skrev en kommentar';

          if (activity.post && activity.post.group && activity.post.group.name) {
            title = (
              <span>
                <span dangerouslySetInnerHTML={{__html: title}}/>
                <span> i </span>
                <a href={`/grupper/${activity.post.group.id}`}
                   dangerouslySetInnerHTML={{__html: twemoji.parse(activity.post.group.name)}}/>
                <span>:</span>
              </span>
            );
          }
          else {
            title += ' ';
          }

          activity = assignToEmpty({
            imageSrc: '',
            id: '',
            timeCreated: Date.now()
          }, activity);

          activity.post = assignToEmpty({
            content: '',
            id: ''
          }, activity.post);

          activity.post.owner = assignToEmpty({
            displayName: '',
            id: ''
          }, activity.post.owner);

          activity.post.group = assignToEmpty({
            id: '',
            name: ''
          }, activity.post.group);

          return (
            <ActivityRow
              likes={0}
              imageSrc={activity.imageSrc}
              key={'comment_' + activity.id}
              title={title}
            >
              <PostView
                content={activity.post.content}
                html={activity.post.html}
                timeCreated={activity.timeCreated}
                owner={activity.post.owner}
                id={activity.post.id}
                profile={this.props.profile}
                groupId={activity.post.groupid}
                likes={activity.post.likes}
                comments={[activity]}
                commentsCount={0}
                numberOfCommentsLoaded={1}
                actions={{}}
                likeActions={this.props.likeActions}
                flagActions={this.props.flagActions}
                groupActions={this.props.groupActions}
                loadingComments={false}
                commentRedirect={`/profil/${activity.owner.id}`}
                uiActions={this.props.uiActions}
                image={activity.post.image}
              />
            </ActivityRow>
          );

        case 'post':
          let postTitle = displayName + ' oprettede et indlæg';

          if (activity.group && activity.group.name) {
            postTitle = (
              <span>
                <span dangerouslySetInnerHTML={{__html: postTitle}}/> i <a
                href={`/grupper/${activity.group.id}`}>{activity.group.name}</a>:
              </span>
            );
          }
          else {
            postTitle += ':';
          }

          activity = assignToEmpty({
            imageSrc: '',
            id: '',
            content: '',
            timeCreated: Date.now()
          }, activity);

          activity.group = assignToEmpty({
            id: '',
            name: ''
          }, activity.group);

          return (
            <ActivityRow
              likes={0}
              imageSrc={activity.imageSrc}
              key={'post_' + activity.id}
              title={postTitle}
            >
              <PostView
                content={activity.content}
                likes={activity.likes}
                html={activity.html}
                timeCreated={activity.timeCreated}
                owner={activity.owner}
                id={activity.id}
                profile={this.props.profile}
                groupId={activity.group.id}
                comments={[]}
                commentsCount={0}
                numberOfCommentsLoaded={0}
                actions={{}}
                flagActions={this.props.flagActions}
                likeActions={this.props.likeActions}
                groupActions={this.props.groupActions}
                loadingComments={false}
                uiActions={this.props.uiActions}
                image={activity.image}
              />
            </ActivityRow>
          );

        default:
          return '';
      }
    });

    let desc = '';
    let showMore = '';

    if (userProfile.description && userProfile.description.length > 0) {
      desc = <p>“{userProfile.description}”</p>;
    }

    if (
      this.props.feed.count &&
      this.props.feed.count.comments &&
      this.props.feed.count.commentsTotal &&
      this.props.feed.count.posts &&
      this.props.feed.count.postsTotal &&
      (this.props.feed.count.posts < this.props.feed.count.postsTotal ||
      this.props.feed.count.comments < this.props.feed.count.commentsTotal)
    ) {
      showMore = (
        <VisFlereButton
          onClick={() => this.props.feedActions.asyncGetUserFeed(
            userProfile.id,
            Math.max(this.props.feed.count.posts, this.props.feed.count.comments)
          )}
        />
      );
    }

    let groupsModalContent = '';
    if (this.state.groups && this.state.groups.length > 0) {
      groupsModalContent = this.renderModalContent(isMyProfile);
    }
    else {
      groupsModalContent = (
        <div className="user-feed--groups-modal--text">
          <h2>{userProfile.displayName} følger ingen grupper!</h2>
          <p>Det var da lidt kedeligt</p>
        </div>
      );
    }

    const modal = (
      (this.props.ui.modal.isOpen) ?
        (<ModalWindow onClose={() => {
          this.props.uiActions.closeModalWindow();
        }}>
          {this.props.ui.modal.children}
        </ModalWindow>) :
        null
    );

    // include edit button when user views her own page.
    const isLoggedIn = this.props.profile.userIsLoggedIn;
    const editLink = this.props.profile.isModerator && MODERATOR_PROFILE_EDIT(this.props.feed.profile.id) || PROFILE_EDIT;
    const currentUserAddressing = (isMyProfile) ? 'du' : userProfile.displayName;
    let owner = userProfile.displayName;
    owner = owner[0].toUpperCase() + owner.slice(1);
    const currentUserOwnership = (isMyProfile) ? 'Din' : (owner + 's');

    let editButton = null;
    let profileImage = null;
    if (isLoggedIn && (isMyProfile || this.props.profile.isModerator)) {
      editButton = (
        <a href={editLink}>
          <div className='p-detail--edit-button'><Icon className="icon" glyph={editSvg}
                                                       width={24} height={24}/></div>
        </a>);
      profileImage = (<a href={editLink}>
        <div className="p-detail--image-container">
          <img src={userProfile.image} alt={userProfile.displayName}/>
        </div>
      </a>);
    }

    else {
      profileImage = (<div className="p-detail--image-container">
        <img src={userProfile.image} alt={userProfile.displayName}/>
      </div>);
    }

    return (
      <PageLayout>
        {modal}
        {profileImage}
        <div className="p-detail--displayname-description-follow">
          <p className="p-detail--displayname" dangerouslySetInnerHTML={{__html: userProfile.displayName}}/>
          {editButton}
          {desc}
          <div className="p-detail--groups-flag-buttons--container">
            <a href="#!Grupper" className="p-detail--groups-button--container" onClick={() => {
              this.props.uiActions.openModalWindow(groupsModalContent);
            }}>
              <div className="p-detail--groups-button"><Icon glyph={grupperSvg} width={42} height={42}/><p>Grupper</p>
              </div>
            </a>
          </div>
        </div>
        {
          (this.props.feed.feed.length > 0) ?
            (<ActivityRow title={`${currentUserOwnership} aktivitet på siden`}/>) :
            (<ActivityRow title={'Her er tomt!'}>{currentUserAddressing.charAt(0).toUpperCase()} har ikke lavet
              noget...</ActivityRow>)
        }

        {feed}
        {showMore}
      </PageLayout>
    );
  }

}

ProfileDetailContainer.displayName = 'ProfileDetailContainer';
ProfileDetailContainer.propTypes = {
  profile: React.PropTypes.object.isRequired,
  feed: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired,
  feedActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  groupActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to props
  (state) => {
    return {
      profile: state.profileReducer,
      group: state.groupViewReducer,
      feed: state.profileFeedReducer,
      ui: state.uiReducer
    };
  },

  // Map actions to props
  (dispatcher) => {
    return {
      feedActions: bindActionCreators(feedActions, dispatcher),
      flagActions: bindActionCreators(flagActions, dispatcher),
      likeActions: bindActionCreators(likeActions, dispatcher),
      groupActions: bindActionCreators(groupActions, dispatcher),
      uiActions: bindActionCreators(uiActions, dispatcher)
    };
  }
)(ProfileDetailContainer);
