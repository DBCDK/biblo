import React from 'react';
import PropTypes from 'prop-types';
import CommentView from './CommentView.component';

export function CommentList({
  comments = [], profile = {}, groupId = null, postId = null, submitFlagFunction = () => {}, uiActions = {}, groupActions = {}, works, coverImages, getMoreWorks, deleteAction
}) {
  return (
    <div className='post-list'>
      {
        comments
        && comments.map((item) => (
          <CommentView key={item.id} {...item}
            groupId={groupId}
            postId={postId}
            profile={profile}
            works={works}
            coverImages={coverImages}
            submitFlagFunction={submitFlagFunction}
            uiActions={uiActions}
            groupActions={groupActions}
            getMoreWorks={getMoreWorks}
            deleteAction={deleteAction}
          />))
        || 'Der er ikke skrevet nogen kommentarer til indlægget endnu'
      }
    </div>);
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  submitFlagFunction: PropTypes.func.isRequired,
  uiActions: PropTypes.object.isRequired,
  groupActions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  works: PropTypes.object.isRequired,
  coverImages: PropTypes.object.isRequired,
  getMoreWorks: PropTypes.func,
  groupId: PropTypes.any,
  postId: PropTypes.any,
  deleteAction: PropTypes.func
};
