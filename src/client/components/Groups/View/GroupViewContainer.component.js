/* eslint-disable react/no-danger */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// COMPONENTS
import PageLayout from '../../Layout/PageLayout.component.js';
import Follow from '../../General/Follow/Follow.component.js';
import GroupHeader from './GroupViewHeader.component.js';
import GroupMembersBox from './GroupViewMembersBox.component.js';
import {PostList} from '../Posts/PostList.component.js';
import PostAdd from '../AddContent/AddContent.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import Icon from '../../General/Icon/Icon.component';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';
import Message from '../../General/Message/Message.component';


// SVG
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

// ACTIONS
import * as profileActions from '../../../Actions/profile.actions';
import * as groupActions from '../../../Actions/group.actions.js';
import * as flagActions from '../../../Actions/flag.actions.js';
import * as likeActions from '../../../Actions/like.actions.js';
import * as uiActions from '../../../Actions/ui.actions.js';
import * as searchActions from '../../../Actions/search.actions';
import * as coverImageActions from '../../../Actions/coverImage.actions';

// SCSS
import './scss/groupView.scss';

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

  componentDidMount() {
    this.props.coverImageActions.asyncListenForCoverImages();
    this.props.groupActions.asyncListenToGroupForNewContent(this.props.group.id);

    if (this.props.profile && this.props.profile.reviews && this.props.profile.reviews.data) {
      this.props.profile.reviews.data.forEach((review) => {
        this.props.coverImageActions.asyncGetCoverImage(review.pid, review.worktype);
        this.props.groupActions.asyncLoadMetadataForReview(review.pid);
      });
    }
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
        <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profile} globalState={this.props.globalState} >
        <div className="error">{this.props.group.error}</div>
        </PageLayout>
      );
    }
    if (this.props.group.markedAsDeleted) {
      return (
        <PageLayout searchState={this.props.searchState} searchActions={this.props.searchActions} profileState={this.props.profile} globalState={this.props.globalState} >
          <div className='group-is-deleted'>
            <h1>Gruppen findes ikke længere</h1>
            <p>Den gruppe du forsøger at komme ind på, findes ikke længere</p>
            <p><a href="/grupper">Du kan se alle de andre grupper her</a></p>
          </div>
        </PageLayout>
      );
    }

    const modal = (this.props.ui.modal.isOpen) ? <ModalWindow
      onClose={() => {
        this.props.uiActions.closeModalWindow();
      }}>{this.props.ui.modal.children}</ModalWindow> : null; // eslint-disable-line

    return (
      <PageLayout
        searchState={this.props.searchState}
        searchActions={this.props.searchActions}
        profileState={this.props.profile}
        globalState={this.props.globalState}

      >
        {modal}
        <div className='group'>
          <GroupHeader uri={this.props.group.imageSquare || ''}/>
          {this.props.group.isClosed &&
          <Message type="warning">Gruppen er lukket, så du kan ikke skrive indlæg eller kommentarer</Message>
          }
          <div className='group--content'>
            <div className="group--details">
              <h2 className='group--title' dangerouslySetInnerHTML={{__html: this.props.group.name}}/>
              <p className='group--description' dangerouslySetInnerHTML={{__html: this.props.group.description}}/>
              <div className='group--follow'>
                <Follow
                  active={this.state.following}
                  onClick={this.toggleFollow}
                  showLoginLink={this.state.showloginToFollowMessage}
                  text={this.state.following && 'Følger' || 'Følg gruppen'}/>
              </div>
            </div>
            {(this.props.profile.id === this.props.group.owner.id || this.props.profile.isModerator) &&
            <div className="group--actions">
              <TinyButton
                active={false}
                clickFunction={() => window.location = `/grupper/${this.props.group.id}/rediger`} // eslint-disable-line no-return-assign
                icon={<Icon glyph={pencilSvg}/>}/>
            </div>
            }
            {(!this.props.group.isClosed || this.props.profile.isModerator) &&
            <div className='group--post-add'>
              <h2>Skriv i gruppen</h2>
              <PostAdd
                redirectTo={`/grupper/${this.props.group.id}`} profile={this.props.profile}
                getMoreWorks={this.props.profileActions.asyncGetUserReviews}
                addContentAction={this.props.groupActions.addPost} works={this.props.group.works}
                parentId={this.props.group.id} type="post" coverImages={this.props.coverImages}/>
            </div>
            }
            <div className='group--post-view'>
              <h2
                className="group--post-view-header">{this.props.group.postsCount} {this.props.group.postsCount === 1 && 'bruger skriver' || 'brugere skriver'}</h2>
              <PostList
                campaign={this.props.group.campaign}
                posts={this.props.group.posts}
                profile={this.props.profile}
                groupId={this.props.group.id}
                coverImages={this.props.coverImages}
                getCoverImage={this.props.coverImageActions.asyncGetCoverImage}
                groupActions={this.props.groupActions}
                uiActions={this.props.uiActions}
                works={this.props.group.works}
                flagActions={this.props.flagActions}
                likeActions={this.props.likeActions}
                getMoreWorks={this.props.profileActions.asyncGetUserReviews}
                groupIsClosed={this.props.group.isClosed}
              />
              {this.props.group.postsCount > this.props.group.numberOfPostsLoaded &&
              <div className="expand-wrapper">
                <ExpandButton
                  isLoading={this.props.group.loadingPosts}
                  onClick={() => this.props.groupActions.asyncShowMorePosts(this.props.group.id, this.props.group.numberOfPostsLoaded, 10)}
                  text="Vis flere"
                />
              </div>
              }
            </div>
          </div>
          <h2 className="group--memberbox-header">{this.props.group.membersCount} følger gruppen</h2>
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
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired,
  id: React.PropTypes.number,
  profile: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  profileActions: React.PropTypes.object,
  groupActions: React.PropTypes.object,
  flagActions: React.PropTypes.object,
  likeActions: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  coverImageActions: React.PropTypes.object.isRequired,
  coverImages: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object,
  globalState: React.PropTypes.object
};

GroupViewContainer.defaultProps = {
  flagActions: {},
  likeActions: {}
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      searchState: state.searchReducer,
      profile: state.profileReducer,
      group: state.groupViewReducer,
      coverImages: state.coverImageReducer,
      ui: state.uiReducer,
      globalState: state.globalReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      profileActions: bindActionCreators(profileActions, dispatch),
      searchActions: bindActionCreators(searchActions, dispatch),
      groupActions: bindActionCreators(groupActions, dispatch),
      flagActions: bindActionCreators(flagActions, dispatch),
      likeActions: bindActionCreators(likeActions, dispatch),
      coverImageActions: bindActionCreators(coverImageActions, dispatch),
      uiActions: bindActionCreators(uiActions, dispatch)
    };
  }
)(GroupViewContainer);
