'use strict';

import React from 'react';
import PostView from './PostView.component.js';

export default function PostList({posts = [], profile = {}}) {
  return (
    <div className='post-list' >
      {
        posts
        && posts.map((item) => (<PostView key={item.id} {...item} profile={profile} />))
        || 'Der er ikke skrevet nogen indlæg i gruppen endnu'
      }
    </div>);
}

PostList.propTypes = {
  posts: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired
};
