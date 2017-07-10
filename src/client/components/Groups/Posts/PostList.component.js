import React from 'react';
import PropTypes from 'prop-types';
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
  campaign: PropTypes.object,
  posts: PropTypes.array.isRequired,
  profile: PropTypes.object.isRequired,
  groupId: PropTypes.number.isRequired,
  groupActions: PropTypes.object.isRequired,
  flagActions: PropTypes.object.isRequired,
  likeActions: PropTypes.object.isRequired,
  uiActions: PropTypes.object.isRequired,
  works: PropTypes.object,
  getMoreWorks: PropTypes.func,
  coverImages: PropTypes.object.isRequired,
  getCoverImage: PropTypes.func.isRequired,
  groupIsClosed: PropTypes.bool
};

PostList.defaultProps = {
  works: {}
};
