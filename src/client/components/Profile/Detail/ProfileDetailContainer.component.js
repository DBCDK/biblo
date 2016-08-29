/* eslint-disable react/no-danger */

/**
 * @file: Dette er den offentlige profil.
 */

// Libs
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import assignToEmpty from '../../../Utils/assign';

// Components
import PageLayout from '../../Layout/PageLayout.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ActivityRow from './ActivityRow.component';
import PostView from '../../Groups/Posts/PostView.component';
import Icon from '../../General/Icon/Icon.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import Follow from '../../General/Follow/Follow.component';
import Tabs from '../../General/Tabs/Tabs.component';
import ReviewsContainer from './ReviewsContainer.component';
import MessagesContainer from '../Messages/MessagesContainer.component';
import GroupViewTile from '../../Groups/View/GroupViewTile.component';

// Actions
import * as agencyActions from '../../../Actions/agency.actions';
import * as feedActions from '../../../Actions/feed.actions';
import * as flagActions from '../../../Actions/flag.actions';
import * as likeActions from '../../../Actions/like.actions';
import * as groupActions from '../../../Actions/group.actions';
import * as uiActions from '../../../Actions/ui.actions';
import * as searchActions from '../../../Actions/search.actions';
import * as workActions from '../../../Actions/work.actions';
import * as coverImageActions from '../../../Actions/coverImage.actions';
import * as profileActions from '../../../Actions/profile.actions';

// SVGs
import grupperSvg from '../../General/Icon/svg/functions/group.svg';
import editSvg from '../../General/Icon/svg/functions/pencil.svg';
import beskederSVG from '../../General/Icon/svg/functions/beskeder.svg';
import aktivitetSVG from '../../General/Icon/svg/functions/aktivitet.svg';
import anmeldelserSVG from '../../General/Icon/svg/functions/anmeldelser.svg';

import {PROFILE_EDIT, MODERATOR_PROFILE_EDIT} from '../../../Constants/hyperlinks.constants';

import './scss/ProfileDetailContainer.component.scss';

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

  componentDidMount() {
    this.props.coverImageActions.asyncListenForCoverImages();
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
            <div key={`group_${group.id}`} className="groups-modal--group">
              <GroupViewTile group={group} postsSinceLast={isMyProfile && group.postsSinceLast} followers={false} />
              {isMyProfile ?
                <Follow active={group.following}
                        onClick={this.toggleFollow.bind(this, group, this.props.profile.id, isMyProfile)}
                        showLoginLink={false}
                        text={group.following && 'Følger' || 'Følg gruppen'}/> : ''}
                 </div>
          );
        })}
      </div>
    );
  }

  getActivityFeed(isMyProfile) {
    return this.props.feed.feed.map((activity) => {
      activity.owner = assignToEmpty({
        id: '',
        displayName: ''
      }, activity.owner);

      let displayName = activity.owner.displayName;

      if (isMyProfile) {
        displayName = 'Du';
      }
      switch (activity.type) {
        case 'comment': {
          let title = displayName + ' skrev en kommentar';

          if (activity.post && activity.post.markedAsDeleted) {
            return;
          }

          if (activity.post && activity.post.group && activity.post.group.name) {
            title = (
              <span>
                  <span dangerouslySetInnerHTML={{__html: title}}/>
                  <span> i </span>
                  <a href={`/grupper/${activity.post.group.id}`}
                     dangerouslySetInnerHTML={{__html: activity.post.group.name}}/>
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
              likes={[]}
              imageSrc={activity.imageSrc}
              key={'comment_' + activity.id}
              title={title}
            >
              <PostView
                campaign={activity.post.group.campaign}
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
                works={this.props.works}
                coverImages={this.props.coverImages}
                getCoverImage={this.props.coverImageActions.asyncGetCoverImage}
                groupIsClosed={activity.post.group.isClosed}
              />
            </ActivityRow>
          );
        }
        case 'post': {
          let postTitle = displayName + ' oprettede et indlæg';

          if (activity.group && activity.group.name) {
            postTitle = (
              <span>
                  <span dangerouslySetInnerHTML={{__html: postTitle}}/>
                  <span> i </span>
                  <a href={`/grupper/${activity.group.id}`}
                     dangerouslySetInnerHTML={{__html: activity.group.name}}/>
                  <span>:</span>
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
            id: null,
            name: ''
          }, activity.group);

          return (
            <ActivityRow
              likes={[]}
              imageSrc={activity.imageSrc}
              key={'post_' + activity.id}
              title={postTitle}
            >
              <PostView
                campaign={activity.group.campaign}
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
                works={this.props.works}
                coverImages={this.props.coverImages}
                getCoverImage={this.props.coverImageActions.asyncGetCoverImage}
                groupIsClosed={activity.group.isClosed}
              />
            </ActivityRow>
          );
        }

        default: {
          return '';
        }
      }
    });
  }

  getModal() {
    return (
      this.props.ui.modal.isOpen ? (
        <ModalWindow onClose={() => {
          this.props.uiActions.closeModalWindow();
        }} title={this.props.ui.modal.title}>
          {this.props.ui.modal.children} </ModalWindow>) : null
    );
  }

  getReviewsFeed() {
    return (
      <ReviewsContainer
        reviews={this.props.reviews.userReviews}
        activeUser={this.props.profile}
        getWorksAction={this.props.workActions.asyncGetWorks}
        worksMetadata={this.props.works.workMetadataOrderedByPid}
        likeActions={this.props.likeActions}
      />
    );
  }

  getShowMoreButton() {
    let showMore = '';
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
            this.props.feed.profile.id,
            Math.max(this.props.feed.count.posts, this.props.feed.count.comments)
          )}
        />
      );
    }

    return showMore;
  }

  getTabs(currentUserAddressing) {
    const isMyProfile = this.props.profile.id === this.props.feed.profile.id;

    const activityFeed = this.getActivityFeed(isMyProfile);
    const reviewsFeed = this.getReviewsFeed();
    const showMore = this.getShowMoreButton();

    const activityPaneContent = (
      <div>
        {
          (this.props.feed.feed.length > 0) ? activityFeed :
            (
              <ActivityRow title={`Her vil du kunne se indlæg og kommentarer skrevet af ${currentUserAddressing}`}/>
            )
        }
        {showMore}
      </div>
    );

    const reviewsPaneContent = (
      <div>
        {
          (reviewsFeed && this.props.reviews.userReviews.length) ? reviewsFeed :
            (
              <ActivityRow title={`Her vil du kunne se anmeldelser skrevet af ${currentUserAddressing}`}/>
            )
        }
      </div>
    );

    const tabs = [
      {
        label: 'ANMELDELSER',
        icon: anmeldelserSVG,
        content: reviewsPaneContent
      },
      {
        label: 'AKTIVITET',
        icon: aktivitetSVG,
        content: activityPaneContent
      }
    ];

    // messages should only be displayed if user is looking at own profile
    if (isMyProfile) {
      const messagesPaneContent = (
        <MessagesContainer
          agencies={this.props.agencies}
          agencyActions={this.props.agencyActions}
          groupActions={this.props.groupActions}
          groupState={this.props.group}
          messages={this.props.profile.userMessages.messages}
          readAction={this.props.profileActions.asyncMarkUserMessageAsRead}
          deleteAction={this.props.profileActions.asyncDeleteUserMessage}
        />
      );

      tabs.push({
        label: 'BESKEDER',
        icon: beskederSVG,
        content: messagesPaneContent,
        counter: this.props.profile.userMessages.unreadMessages
      });
    }

    return tabs;
  }

  renderCampaignBadges (campaigns, isMyProfile) {
    let campaignDiplomaButtons = null;
    if (campaigns) {
      campaignDiplomaButtons = campaigns.map(campaign => {
        return this.renderCampaignBadge(campaign, isMyProfile);
      });
    }
    return campaignDiplomaButtons;
  }

  renderCampaignBadge (campaign, isMyProfile) {
    const downloadUrl = `/kampagne/bevis/${campaign.id}.pdf`;
    let logo;
    if (campaign.logos.svg) {
      logo = (<img src={campaign.logos.svg} className='svg' width={80}/>);
    }
    else {
      logo = (<img src={campaign.logos.small} width={80}/>);
    }

    let badge;
    if (isMyProfile) {
      badge = (<a href={downloadUrl}>{logo}</a>);
    }
    else {
      badge = logo;
    }

    return (<span className="p-detail--diploma " key={`campaign_${campaign.id}`}>{badge}</span>);
  }

  renderGroupButton (userProfile, groupsModalContent, modalTitle, isMyProfile, size) {
    return (
        <a href="#!Grupper" onClick={() => {
          this.props.uiActions.openModalWindow(groupsModalContent, modalTitle);
        }}>
          <div className="p-detail--group-button">
            <Icon glyph={grupperSvg} width={size} height={size}/><div>Grupper</div>
          </div>
          {isMyProfile && userProfile.postsInGroups &&
          <div className="p-detail--total-posts-since-last">
            {userProfile.postsInGroups <= 30 ? userProfile.postsInGroups : '30+'}
          </div> || null}
        </a>
    );
  }

  render() {
    let userProfile = this.props.feed.profile;
    userProfile = assignToEmpty(userProfile, {
      image: userProfile && userProfile.image && userProfile.image.medium || '/no_profile.png'
    });

    const isMyProfile = this.props.profile.id === this.props.feed.profile.id;
    const isLoggedIn = this.props.profile.userIsLoggedIn;
    const displayName = userProfile.raw ? userProfile.raw.displayName : userProfile.displayName;

    const currentUserAddressing = (isMyProfile) ? 'dig' : displayName;
    const tabs = this.getTabs(currentUserAddressing);

    let desc = '';

    if (userProfile.description && userProfile.description.length > 0) {
      desc = (
        <p>
          <span className="profile--description" dangerouslySetInnerHTML={{__html: userProfile.description}}/>
        </p>
      );
    }

    let groupsModalContent = '';
    let groupsModalTitle = '';

    if (this.state.groups && this.state.groups.length > 0) {
      groupsModalContent = this.renderModalContent(isMyProfile);
      groupsModalTitle = this.state.groups.length > 1 && `${this.state.groups.length} Grupper` || '1 Gruppe';
    }
    else {
      groupsModalContent = (
        <div className="user-feed--groups-modal--text">
          <h2>{userProfile.displayName} følger ingen grupper!</h2>
          <p>Det var da lidt kedeligt</p>
        </div>
      );
      groupsModalTitle = '0 Grupper';
    }

    const campaigns = this.props.feed.campaigns;

    let campaignDiplomaButtons = this.renderCampaignBadges(campaigns, isMyProfile);
    const modal = this.getModal();

    // include edit button when user views her own page.
    const editLink = this.props.profile.isModerator && MODERATOR_PROFILE_EDIT(this.props.feed.profile.id) || PROFILE_EDIT;

    let editButton = null;
    let profileImage = null;
    if (isLoggedIn && (isMyProfile || this.props.profile.isModerator)) {
      editButton = (
        <a href={editLink}>
          <div className='p-detail--edit-button'>
            <Icon className="icon" glyph={editSvg}
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
      <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profile} globalState={this.props.globalState} >
        {modal}
        <div className="p-detail--badge-container">
          <div className="p-detail--diploma-wrapper">
             <div className="p-detail--diploma-container">{campaignDiplomaButtons}</div>
           </div>
           <div className="p-detail--buttons-wrapper">
             <div className="p-detail--buttons-container">
               {this.renderGroupButton(userProfile, groupsModalContent, groupsModalTitle, isMyProfile, 40)}
             </div>
           </div>
        </div>
        {profileImage}
        <div className="p-detail--displayname-description-follow">
          <p className="p-detail--displayname" dangerouslySetInnerHTML={{__html: userProfile.displayName}}/>
          {editButton}
          {desc}
          <div className="p-detail--buttons-container--mobile">
            {this.renderGroupButton(userProfile, groupsModalContent, groupsModalTitle, isMyProfile, 42)}
          </div>
        </div>
        <div className="p-detail--activity-tabs">
          <Tabs tabs={tabs} selected={this.props.selectedTab}/>
        </div>
      </PageLayout>
    );
  }

}

ProfileDetailContainer.displayName = 'ProfileDetailContainer';
ProfileDetailContainer.propTypes = {
  agencies: React.PropTypes.object.isRequired,
  agencyActions: React.PropTypes.object.isRequired,
  feed: React.PropTypes.object.isRequired,
  feedActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired,
  groupActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired,
  profileActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  reviews: React.PropTypes.object.isRequired,
  selectedTab: React.PropTypes.number,
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object.isRequired,
  coverImages: React.PropTypes.object.isRequired,
  coverImageActions: React.PropTypes.object.isRequired,
  works: React.PropTypes.object.isRequired,
  workActions: React.PropTypes.object.isRequired,
  globalState: React.PropTypes.object.isRequired
};

ProfileDetailContainer.defaultProps = {
  selectedTab: 0
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to props
  (state) => {
    return {
      agencies: state.agencyReducer,
      searchState: state.searchReducer,
      profile: state.profileReducer,
      group: state.groupViewReducer,
      feed: state.profileFeedReducer,
      ui: state.uiReducer,
      reviews: state.reviewReducer,
      coverImages: state.coverImageReducer,
      works: state.workReducer,
      globalState: state.globalReducer
    };
  },

  // Map actions to props
  (dispatcher) => {
    return {
      agencyActions: bindActionCreators(agencyActions, dispatcher),
      searchActions: bindActionCreators(searchActions, dispatcher),
      feedActions: bindActionCreators(feedActions, dispatcher),
      flagActions: bindActionCreators(flagActions, dispatcher),
      likeActions: bindActionCreators(likeActions, dispatcher),
      groupActions: bindActionCreators(groupActions, dispatcher),
      uiActions: bindActionCreators(uiActions, dispatcher),
      coverImageActions: bindActionCreators(coverImageActions, dispatcher),
      profileActions: bindActionCreators(profileActions, dispatcher),
      workActions: bindActionCreators(workActions, dispatcher)
    };
  }
)(ProfileDetailContainer);
