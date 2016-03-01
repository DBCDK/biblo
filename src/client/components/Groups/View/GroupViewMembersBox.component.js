'use strict';

import React from 'react';
import './scss/group-members-box.scss';
import MoreButton from '../../General/MoreButton/MoreButton.component.js';

export default function GroupMembersBox({members, owner, onExpand, isExpanded}) {

  // this is necessary to avoid modifying Redux state
  let membersCopy = members.slice();

  // mark owner and add to members
  owner.isOwner = true;
  membersCopy.unshift(owner);

  if (!isExpanded) {
    // show only the first 9 members
    membersCopy = membersCopy.slice(0, 9);
  }

  const memberImages = membersCopy.map((member) => {
    const classes = 'member-image ' + ((typeof member.isOwner !== 'undefined') ? 'owner': '');
    return <div key={member.id} className={classes}><img src={member.image || null} alt={member.displayName}/></div>;
  });

  const buttonText = (isExpanded) ? 'Vis færre' : 'Vis alle';

  return (
    <div className='group--sidebar'>
      <div className='group-view-members-box'>
        {memberImages}
      </div>
      <div className='members-button'>
        <MoreButton onClick={onExpand} text={buttonText}/>
      </div>
    </div>
  );
}

GroupMembersBox.propTypes = {
  onExpand: React.PropTypes.func.isRequired,
  isExpanded: React.PropTypes.bool.isRequired,
  members: React.PropTypes.array.isRequired,
  owner: React.PropTypes.object.isRequired
};
