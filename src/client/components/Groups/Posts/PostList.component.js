'use strict';

import React from 'react';
import PostView from './PostView.component.js';

export default function PostList({posts = [], profile = {}, groupId= null, actions = null}) {
  return (
    <div className='post-list' >
      {
        posts
        && posts.map((item) => (<PostView key={item.id} {...item} profile={profile} groupId={groupId} actions={actions} />))
        || 'Der er ikke skrevet nogen indlæg i gruppen endnu'
      }
    </div>);
}

PostList.propTypes = {
  posts: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired,
  groupId: React.PropTypes.number.isRequired,
  actions: React.PropTypes.object.isRequired
};
