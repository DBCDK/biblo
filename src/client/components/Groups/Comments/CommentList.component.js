'use strict';

import React from 'react';
import CommentView from './CommentView.component';

export default function CommentList({comments = [], profile = {}}) {
  return (
    <div className='post-list' >
      {
        comments
        && comments.map((item) => (<CommentView key={item.id} {...item} profile={profile}/>))
        || 'Der er ikke skrevet nogen kommentarer til indlægget endnu'
      }
    </div>);
}

CommentList.propTypes = {
  comments: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired
};
