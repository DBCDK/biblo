import React from 'react';
import PostView from './PostView.component.js';

export function PostList({
  posts = [],
  profile = {},
  groupId = null,
  uiActions = null,
  groupActions = null,
  flagActions = null,
  likeActions = null,
  works,
  coverImages,
  getCoverImage,
  getMoreWorks,
  campaign = {},
  groupIsClosed = false
}) {
  return (
    <div className='post-list'>
      {
        posts
        && posts.map((item) => (
          <PostView
            campaign={campaign}
            key={item.id} {...item}
            profile={profile}
            likes={item.likes}
            groupId={groupId}
            uiActions={uiActions}
            groupActions={groupActions}
            flagActions={flagActions}
            likeActions={likeActions}
            works={works}
            coverImages={coverImages}
            getCoverImage={getCoverImage}
            getMoreWorks={getMoreWorks}
            groupIsClosed={groupIsClosed}
          />
        ))
        || 'Der er ikke skrevet nogen indlæg i gruppen endnu'
      }
    </div>);
}

PostList.displayName = 'PostList';
PostList.propTypes = {
  campaign: React.PropTypes.object,
  posts: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired,
  groupId: React.PropTypes.number.isRequired,
  groupActions: React.PropTypes.object.isRequired,
  flagActions: React.PropTypes.object.isRequired,
  likeActions: React.PropTypes.object.isRequired,
  uiActions: React.PropTypes.object.isRequired,
  works: React.PropTypes.object,
  getMoreWorks: React.PropTypes.func,
  coverImages: React.PropTypes.object.isRequired,
  getCoverImage: React.PropTypes.func.isRequired,
  groupIsClosed: React.PropTypes.bool
};

PostList.defaultProps = {
  works: {}
};
