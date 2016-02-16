'use strict';

import React from 'react';
import PostView from './PostView.component.js';

export default function PostList({posts = []}) {
  const dummy = {
    name: 'Søren V',
    imageSrc: 'http://lorempixel.com/100/100/'
  };

  return (
    <div className='post-list' >
      {
        posts
        && posts.map((item) => (<PostView key={item.id} {...item} profile={dummy} />))
        || 'Der er ikke skrevet nogen indlæg i gruppen endnu'
      }
    </div>);
}

PostList.propTypes = {
  posts: React.PropTypes.array.isRequired
};
