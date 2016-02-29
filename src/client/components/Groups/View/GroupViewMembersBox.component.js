'use strict';

import React from 'react';
import './scss/group-members-box.scss';
import MoreButton from '../../General/MoreButton/MoreButton.component.js';

export default function GroupMembersBox({members, owner}) {

  // this is necessary to avoid modifying Redux state
  let membersCopy = members.slice();

  // mark owner and add to members
  owner.isOwner = true;
  membersCopy.unshift(owner);

  const memberImages = membersCopy.map((member) => {
    const classes = 'member-image ' + ((typeof member.isOwner !== 'undefined') ? 'owner': '');
    return <div className={classes}><img src={member.image || null} alt={member.displayName}/></div>
  });

  return (
    <div className='group--sidebar'>
      <div className='group-view-members-box'>
        {memberImages}
      </div>
      <div className='members-button'>
        <MoreButton onClick={() => {}} text={'Vis flere'}/>
      </div>
    </div>
  );
}

GroupMembersBox.propTypes = {
  members: React.PropTypes.array.isRequired,
  owner: React.PropTypes.object.isRequired
};
