'use strict';

import React from 'react';
import PostView from './PostView.component.js';


export default function PostList({posts = [], profile = {}, groupId= null, uiActions = null, groupActions = null, flagActions = null}) {
  return (
    <div className='post-list' >
      {
        posts
        && posts.map((item) => (<PostView
          key={item.id} {...item}
          profile={profile}
          groupId={groupId}
          uiActions={uiActions}
          groupActions={groupActions}
          flagActions={flagActions}
          />))
        || 'Der er ikke skrevet nogen indlæg i gruppen endnu'
      }
    </div>);
}

PostList.propTypes = {
  posts: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired,
  groupId: React.PropTypes.number.isRequired,
  groupActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired
};
