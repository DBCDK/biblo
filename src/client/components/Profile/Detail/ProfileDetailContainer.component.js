'use strict';

/**
 * @file: Dette er den offentlige profil.
 */

import React from 'react';
import {connect} from 'react-redux';

import PageLayout from '../../Layout/PageLayout.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ActivityRow from './ActivityRow.component';
import PostView from '../../Groups/Posts/PostView.component';
import Follow from '../../General/Follow/Follow.component';

import './ProfileDetailContainer.component.scss';

class ProfileDetailContainer extends React.Component {
  render() {
    let userProfile = this.props.feed.profile;
    userProfile.image = userProfile.image.url.medium;
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

    if (userProfile.description && userProfile.description.length > 0) {
      desc = <p>“{userProfile.description}”</p>;
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
        </div>

        <ActivityRow title="Se hvad Sofiie92 har lavet:" />

        {feed}

        <VisFlereButton onClick={() => {}} />
      </PageLayout>
    );
  }
}

ProfileDetailContainer.displayName = 'ProfileDetailContainer';
ProfileDetailContainer.propTypes = {
  profile: React.PropTypes.object.isRequired,
  feed: React.PropTypes.object.isRequired
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
  () => {
    return {};
  }
)(ProfileDetailContainer);
