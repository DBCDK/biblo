'use strict';

import React from 'react';

export default function GroupHeader({uri}) {
  return (
    <div className='header-image' >
      <div className='background-image' style={{backgroundImage: `url("${uri}")`}} ></div>
      <div className='foreground-image' ><img src={uri} /></div>
    </div>
  );
}

GroupHeader.propTypes = {
  uri: React.PropTypes.string.isRequired
};
