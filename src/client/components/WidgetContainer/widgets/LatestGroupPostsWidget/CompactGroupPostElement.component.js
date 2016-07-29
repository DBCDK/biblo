/**
 * @file: This file contains the compact group post element, this is meant to be displayed in a grid, and originally constructed for the latest group posts widget.
 */

/* eslint-disable react/no-danger */

import React, {PropTypes} from 'react';
import './scss/CompactGroupPostElement.component.scss';

function renderTextGroupPost(post) {
  return <span className="compact-group-post-element--text-post"> "<span dangerouslySetInnerHTML={{__html: post.html}} />"</span>;
}

function renderImageGroupPost(post) { // eslint-disable-line react/no-multi-comp
  return (
    <div className="compact-group-post-element--image-post">
      <img src={post.image} />
    </div>
  );
}

export function renderVideoGroupPost(post) { // eslint-disable-line react/no-multi-comp
  const resolution = post.video.resolutions.slice(-1)[0];
  const pureFileName = resolution.video.name.substring(0, resolution.video.name.lastIndexOf('.'));
  const videoImageSrc = `https://s3-eu-west-1.amazonaws.com/uxdev-biblo-video-thumbnails/${pureFileName}_thumb_00001.png`;

  return (
    <div className="compact-group-post-element--video-post">
      <img src={videoImageSrc} />
      <span className="after" />
    </div>
  );
}

export function CompactGroupPostElement({post}) { // eslint-disable-line react/no-multi-comp
  let postBody;
  let postType;
  if (post.video) {
    postType = 'video';
    postBody = renderVideoGroupPost(post);
  }
  else if (post.image) {
    postType = 'image';
    postBody = renderImageGroupPost(post);
  }
  else {
    postType = 'text';
    postBody = renderTextGroupPost(post);
  }

  return (
    <span className={`compact-group-post-element--container ${postType}--post`}>
      <p className="compact-group-post-element--author">
        Af: <a dangerouslySetInnerHTML={{__html: post.owner.displayName}} href={`/profil/${post.owner.id}`} />
      </p>
      <a href={`/profil/${post.owner.id}`} className="compact-group-post-element--author--image--container">
        <img src={post.owner.image} />
      </a>
      <a href={`/grupper/${post.groupid}/${post.id}`}>
        {postBody}
      </a>
    </span>
  );
}

CompactGroupPostElement.displayName = 'CompactGroupPostElement';
CompactGroupPostElement.propTypes = {
  post: PropTypes.object.isRequired
};
