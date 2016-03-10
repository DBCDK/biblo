'use strict';

import React from 'react';
import CommentView from './CommentView.component';

export default function CommentList({comments = [], profile = {}, submitFlagFunction = () => {}, uiActions= {}}) {
  return (
    <div className='post-list' >
      {
        comments
        && comments.map((item) => (<CommentView key={item.id} {...item} commentId={item.id} profile={profile} submitFlagFunction={submitFlagFunction} uiActions={uiActions}/>))
        || 'Der er ikke skrevet nogen kommentarer til indlægget endnu'
      }
    </div>);
}

CommentList.propTypes = {
  comments: React.PropTypes.array.isRequired,
  submitFlagFunction: React.PropTypes.func.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired
};
