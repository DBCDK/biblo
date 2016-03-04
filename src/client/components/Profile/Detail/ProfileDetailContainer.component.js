'use strict';

/**
 * @file: Dette er den offentlige profil.
 */

import React from 'react';
import {connect} from 'react-redux';

import PageLayout from '../../Layout/PageLayout.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ActivityRow from './ActivityRow.component';

import './ProfileDetailContainer.component.scss';

class ProfileDetailContainer extends React.Component {
  render() {
    let userProfile = this.props.feed.profile;
    let feed = this.props.feed.feed.map((activity) => {
      switch (activity.type) {
        case 'comment':
          let title = userProfile.displayName + ' skrev en kommentar';

          if (activity.post && activity.post.group && activity.post.group.name) {
            title += ' til et indlæg i gruppen ' + activity.post.group.name + ':';
          }
          else {
            title += ' til et indlæg:';
          }

          return (
            <ActivityRow
              date={activity.timeCreated}
              likes={0}
              imageSrc={activity.imageSrc}
              key={'comment_' + activity.id}
              answerFunction={() => {}}
              title={title}
            >
              <p>{activity.content}</p>
            </ActivityRow>
          );

        case 'post':
          return (
            <ActivityRow
              date={activity.timeCreated}
              likes={0}
              imageSrc={activity.imageSrc}
              key={'post_' + activity.id}
              answerFunction={() => {}}
              title={userProfile.displayName + ' oprettede et indlæg i gruppen ' + activity.group.name + ':'}
            >
              <p>{activity.content}</p>
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
          <img src="/no_profile.png" />
        </div>

        <div className="p-detail--displayname-description-follow">
          <p className="p-detail--displayname">{userProfile.displayName}</p>
          {desc}
          <button>Følg</button>
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
