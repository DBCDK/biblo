'use strict';

/**
 * @file: Dette er den offentlige profil.
 */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import assignToEmpty from '../../../Utils/assign';

import PageLayout from '../../Layout/PageLayout.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ActivityRow from './ActivityRow.component';
import PostView from '../../Groups/Posts/PostView.component';
import Icon from '../../General/Icon/Icon.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';

import * as feedActions from '../../../Actions/feed.actions';
import * as flagActions from '../../../Actions/flag.actions';
import * as uiActions from '../../../Actions/ui.actions';

import grupperSvg from '../../General/Icon/svg/functions/group.svg';
import editSvg from '../../General/Icon/svg/functions/pencil.svg';

import {PROFILE_EDIT} from '../../../Constants/hyperlinks.constants';


import './ProfileDetailContainer.component.scss';

export class ProfileDetailContainer extends React.Component {
  render() {
    let userProfile = this.props.feed.profile;
    userProfile = assignToEmpty(userProfile, {
      image: userProfile && userProfile.image && userProfile.image.url && userProfile.image.url.medium || '/no_profile.png'
    });

    let feed = this.props.feed.feed.map((activity) => {
      switch (activity.type) {
        case 'comment':
          let title = userProfile.displayName + ' skrev en kommentar';

          if (activity.post && activity.post.group && activity.post.group.name) {
            title = (
              <span>
                {title} til et indlæg i gruppen <a href={`/grupper/${activity.post.group.id}`}>{activity.post.group.name}</a>:
              </span>
            );
          }
          else {
            title += ' til et indlæg:';
          }

          activity.owner = userProfile;

          if (activity.image && activity.image.id) {
            activity.image = '/billede/' + activity.image.id + '/small';
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
                timeCreated={activity.timeCreated}
                owner={userProfile}
                id={activity.post.id}
                profile={this.props.profile}
                groupId={activity.post.groupid}
                comments={[activity]}
                commentsCount={0}
                numberOfCommentsLoaded={1}
                actions={{}}
                flagActions={this.props.flagActions}
                loadingComments={false}
                commentRedirect={`/profil/${userProfile.id}`}
                uiActions={this.props.uiActions}
              />
            </ActivityRow>
          );

        case 'post':
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
              title={userProfile.displayName + ' oprettede et indlæg i gruppen ' + activity.group.name + ':'}
            >
              <PostView
                content={activity.content}
                timeCreated={activity.timeCreated}
                owner={userProfile}
                id={activity.id}
                profile={this.props.profile}
                groupId={activity.group.id}
                comments={[]}
                commentsCount={0}
                numberOfCommentsLoaded={0}
                actions={{}}
                flagActions={this.props.flagActions}
                loadingComments={false}
                uiActions={this.props.uiActions}
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

    if (userProfile.groups && userProfile.groups.length > 0) {
      groupsModalContent = (
        <div className="groups-modal--container">
          {userProfile.groups.map((group) => {
            return (
              <a key={`group_${group.id}`} href={'/grupper/' + group.id} className="user-feed--groups-modal--group">
                <img
                  className="user-feed--groups-modal--group-image"
                  src={group.coverImage ? `/billede/${group.coverImage.id}/small-square` : '/no_group_image.png'}
                />
                <div className="user-feed--groups-modal--group-name">{group.name}</div>
              </a>
            );
          })}
        </div>
      );
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

    return (
      <PageLayout>
        {modal}

        <div className="p-detail--image-container">
          <img src={userProfile.image} alt={userProfile.displayName} />
        </div>

        <div className="p-detail--displayname-description-follow">
          <p className="p-detail--displayname">{userProfile.displayName}</p>
          <a href={PROFILE_EDIT} className='p-detail--edit-button'><Icon glyph={editSvg} width={24} height={24} /></a>
          {desc}
          <div className="p-detail--groups-flag-buttons--container">
            <a href="#!Grupper" className="p-detail--groups-button--container" onClick={() => {
              this.props.uiActions.openModalWindow(groupsModalContent);
            }}>
              <div className="p-detail--groups-button"> <Icon glyph={grupperSvg} width={42} height={42} /><p>Grupper</p></div>
            </a>

          </div>
        </div>

        {
          (this.props.feed.feed.length > 0) ?
            (<ActivityRow title={`Se hvad ${userProfile.displayName} har lavet:`} />) :
            (<ActivityRow title={'Her er tomt!'}>{userProfile.displayName} har ikke lavet noget...</ActivityRow>)
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
  feedActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
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
      feed: state.profileFeedReducer,
      ui: state.uiReducer
    };
  },

  // Map actions to props
  (dispatcher) => {
    return {
      feedActions: bindActionCreators(feedActions, dispatcher),
      flagActions: bindActionCreators(flagActions, dispatcher),
      uiActions: bindActionCreators(uiActions, dispatcher)
    };
  }
)(ProfileDetailContainer);
