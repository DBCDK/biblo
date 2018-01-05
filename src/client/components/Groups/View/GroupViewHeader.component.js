import React from 'react';
import PropTypes from 'prop-types';

import './scss/groupViewHeader.scss';

/**
 * Renders the header of the group. The foreground image will be clickable and link to the group with the given id.
 *
 * @param {string} uri
 * @param {number} groupId The id of the group the link should point to
 */
export function GroupViewHeader({uri, groupId}) {
  return (
    <div className='group-header' >
      <div className='group-header--background-image' style={{backgroundImage: `url("${uri}")`}} ></div>
      <div className='group-header--foreground-image' ><a href={`/grupper/${groupId}`}><img src={uri} /></a></div>
    </div>
  );
}

GroupViewHeader.propTypes = {
  uri: PropTypes.string.isRequired,
  groupId: PropTypes.number.isRequired
};
