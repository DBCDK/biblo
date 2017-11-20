/**
 * @file: This file contains the compact group post element, this is meant to be displayed in a grid, and originally
 *   constructed for the latest group posts widget.
 */

/* eslint-disable react/no-danger */

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../General/Icon/Icon.component';
import sanitizeHtml from './../../../../Utils/sanitizeHtml.util';
import groupSvg from '../../../General/Icon/svg/functions/group.svg';
import './scss/CompactGroupPostElement.component.scss';

function renderTextGroupPost(post) {
  return (
    <span className="text--post">
      {' '}
      &quot;<span dangerouslySetInnerHTML={{__html: sanitizeHtml(post.html)}} />&quot;
    </span>
  );
}

function renderImageGroupPost(post) {
  // eslint-disable-line react/no-multi-comp
  return (
    <div className="compact-group-post-element--image-post">
      <img src={post.image} />
    </div>
  );
}

function renderPDFGroupPost(post) {
  // eslint-disable-line react/no-multi-comp
  return (
    <div className="compact-group-post-element--pdf-post">
      <img src="/images/materialtypes/pdf.png" alt="Indlæg med PDF" />
      <div className="pdf-post--text-content">
        &quot;<span dangerouslySetInnerHTML={{__html: sanitizeHtml(post.html)}} />&quot;
      </div>
    </div>
  );
}

export function renderVideoGroupPost(post) {
  // eslint-disable-line react/no-multi-comp
  const resolution = post.video.resolutions.slice(-1)[0];
  const pureFileName = resolution.video.name.substring(0, resolution.video.name.lastIndexOf('.'));
  const videoImageSrc = `https://s3-eu-west-1.amazonaws.com/uxdev-biblo-video-thumbnails/${pureFileName}_thumb_00001.png`;

  return (
    <div className="compact-group-post-element--video-post">
      <img src={videoImageSrc} />
    </div>
  );
}

export function CompactGroupPostElement({post, groupName, groupHref}) {
  // eslint-disable-line react/no-multi-comp
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
  else if (post.pdf) {
    postType = 'pdf';
    postBody = renderPDFGroupPost(post);
  }
  else {
    postType = 'text';
    postBody = renderTextGroupPost(post);
  }

  let groupNameTag = '';
  if (groupName) {
    groupNameTag = (
      <a href={groupHref} className="cgp--group-link">
        <Icon glyph={groupSvg} /> {groupName}
      </a>
    );
  }

  let quoteClasses = 'widget-element--content quote';
  if (post.content && post.content.length > 150) {
    quoteClasses += ' long';
  }

  return (
    <div className={`widget-element compact-group-post-element--container ${postType}--post`}>
      <div className="compact-group-post-element">
        <div className="widget-element--author">
          Af:
          <a
            dangerouslySetInnerHTML={{__html: sanitizeHtml(post.owner.displayName)}}
            href={`/profil/${post.owner.id}`}
          />
        </div>
        <div className="widget-element--main">
          <a href={`/profil/${post.owner.id}`} className="widget-element--profileimage">
            <img src={post.owner.image} />
          </a>
          <a href={`/grupper/${post.groupid}/${post.id}`} className={quoteClasses}>
            {postBody}
          </a>
          {groupNameTag}
        </div>
      </div>
    </div>
  );
}

CompactGroupPostElement.displayName = 'CompactGroupPostElement';
CompactGroupPostElement.propTypes = {
  post: PropTypes.object.isRequired,
  groupName: PropTypes.string,
  groupHref: PropTypes.string,
  elementHref: PropTypes.string
};
