import React from 'react';

import './scss/groupViewHeader.scss';

export default function GroupHeader({uri}) {
  return (
    <div className='group-header' >
      <div className='group-header--background-image' style={{backgroundImage: `url("${uri}")`}} ></div>
      <div className='group-header--foreground-image' ><img src={uri} /></div>
    </div>
  );
}

GroupHeader.propTypes = {
  uri: React.PropTypes.string.isRequired
};
