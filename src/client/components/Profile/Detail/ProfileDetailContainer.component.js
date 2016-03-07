'use strict';

/**
 * @file: Dette er den offentlige profil.
 */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PageLayout from '../../Layout/PageLayout.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ActivityRow from './ActivityRow.component';
import PostView from '../../Groups/Posts/PostView.component';
import Follow from '../../General/Follow/Follow.component';
import Icon from '../../General/Icon/Icon.component';

import * as feedActions from '../../../Actions/feed.actions';

import flagSvg from '../../General/Icon/svg/functions/flag.svg';
import grupperSvg from '../../General/Icon/svg/functions/group.svg';

import './ProfileDetailContainer.component.scss';

class ProfileDetailContainer extends React.Component {
  render() {
    let userProfile = this.props.feed.profile;
    userProfile.image = userProfile && userProfile.image && userProfile.image.url && userProfile.image.url.medium || '/no_profile.png';
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
                groupId={activity.post.group.id}
                comments={[activity]}
                commentsCount={0}
                numberOfCommentsLoaded={1}
                actions={{}}
                loadingComments={false}
                commentRedirect={`/profil/${userProfile.id}`}
              />
            </ActivityRow>
          );

        case 'post':
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
                loadingComments={false}
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

    return (
      <PageLayout>
        <div className="p-detail--image-container">
          <img src={userProfile.image || '/no_profile.png'} alt={userProfile.displayName} />
        </div>

        <div className="p-detail--displayname-description-follow">
          <p className="p-detail--displayname">{userProfile.displayName}</p>
          {desc}
          <Follow active={false} text="Følg" />
          <div className="p-detail--groups-flag-buttons--container">
            <a href="#!Grupper" className="p-detail--groups-button--container">
              <div className="p-detail--groups-button"> <Icon glyph={grupperSvg} width={42} height={42} /><p> Grupper </p></div>
            </a>
            <a href="#!FlagUser" className="p-detail--flag-button--container">
              <div className="p-detail--flag-button"> <Icon glyph={flagSvg} width={42} height={42} /><p> Anmeld </p></div>
            </a>
          </div>
        </div>

        <ActivityRow title={`Se hvad ${userProfile.displayName} har lavet:`} />

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
  feedActions: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to props
  (state) => {
    return {
      profile: state.profileReducer,
      feed: state.profileFeedReducer
    };
  },

  // Map actions to props
  (dispatcher) => {
    return {
      feedActions: bindActionCreators(feedActions, dispatcher)
    };
  }
)(ProfileDetailContainer);
