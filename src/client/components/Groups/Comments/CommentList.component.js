import React from 'react';
import CommentView from './CommentView.component';

export default function CommentList({comments = [], profile = {}, groupId = null, postId = null, submitFlagFunction = () => {
}, uiActions= {}, groupActions = {}, works, coverImages}) {
  return (
    <div className='post-list'>
      {
        comments
        && comments.map((item) => (
          <CommentView key={item.id} {...item} groupId={groupId} postId={postId} profile={profile} works={works} coverImages={coverImages}
                       submitFlagFunction={submitFlagFunction} uiActions={uiActions} groupActions={groupActions}/>))
        || 'Der er ikke skrevet nogen kommentarer til indlægget endnu'
      }
    </div>);
}

CommentList.propTypes = {
  comments: React.PropTypes.array.isRequired,
  submitFlagFunction: React.PropTypes.func.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  groupActions: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired,
  works: React.PropTypes.object.isRequired,
  coverImages: React.PropTypes.object.isRequired,
  groupId: React.PropTypes.any,
  postId: React.PropTypes.any
};
