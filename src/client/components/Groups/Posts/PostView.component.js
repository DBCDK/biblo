'use strict';

import './scss/PostView.scss';

import React from 'react';
import TimeToString from '../../../Utils/timeToString.js';
import CommentAdd from '../AddContent/AddContent.component';
import CommentList from '../Comments/CommentList.component';
import Icon from '../../General/Icon/Icon.component.js';
import TinyButton from '../../General/TinyButton/TinyButton.component.js';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component';

import backSvg from '../../General/Icon/svg/functions/back.svg';
import flagSvg from '../../General/Icon/svg/functions/flag.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

export default
class PostView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCommentInputVisible: false
    };
  }

  toggleCommentInput(event) {
    event.preventDefault();
    this.setState({isCommentInputVisible: !this.state.isCommentInputVisible});
  }

  render() {
    const {content, image, timeCreated, owner, id, profile, groupId, comments, commentsCount, numberOfCommentsLoaded, actions, loadingComments} = this.props;

    return (
      <div className='post-wrapper'>
        <div className='post-profile-image'>
          <img src={owner.image || null} alt={owner.displayName}/>
        </div>
        <div className='post'>
          <div className='post--header'>
            <span className='username'>{owner.displayName}</span>
            <span className='time'>{TimeToString(timeCreated)}</span>
            <span className='buttons'>
              <TinyButton icon={<Icon glyph={flagSvg}/>}/>
              <TinyButton icon={<Icon glyph={pencilSvg}/>}/>
            </span>
          </div>
          <div className='post--content'>
            <p className='content'>{content}</p>
            {
              image &&
              <div className='media'><img src={image} alt="image for post"/></div>
            }
          </div>
          <CommentList comments={comments} profile={profile} groupId={groupId}/>

          <div className="post--load-more-comments">
            {commentsCount > numberOfCommentsLoaded &&
            <ExpandButton isLoading={loadingComments} onClick={() => actions.asyncShowMoreComments(id, numberOfCommentsLoaded, 10)} text="Vis flere" />
            }
            {commentsCount && <span
              className="post--comment-count">{commentsCount} {commentsCount === 1 && 'kommentar' || 'kommentarer'}</span>
              || ''
            }
          </div>
          {this.state.isCommentInputVisible &&
          <div className="comment-add-wrapper">
            <CommentAdd redirectTo={`/grupper/${groupId}`} profile={profile} parentId={id} type="comment"
                        abort={e => this.toggleCommentInput(e)}/>
          </div>
          ||
          <a className="comment-add-button" href="#add-comment"
             onClick={e => this.toggleCommentInput(e)}><Icon glyph={backSvg}/>Svar</a>
          }
        </div>
      </div>
    );
  }
}
PostView.propTypes = {
  actions: React.PropTypes.object,
  content: React.PropTypes.string,
  image: React.PropTypes.string,
  timeCreated: React.PropTypes.string,
  owner: React.PropTypes.object,
  id: React.PropTypes.number,
  profile: React.PropTypes.object,
  groupId: React.PropTypes.number,
  comments: React.PropTypes.array,
  commentsCount: React.PropTypes.number,
  numberOfCommentsLoaded: React.PropTypes.number,
  loadingComments: React.PropTypes.bool
};
