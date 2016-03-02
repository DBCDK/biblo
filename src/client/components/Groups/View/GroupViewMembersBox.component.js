'use strict';

import React from 'react';
import './scss/group-members-box.scss';
import MoreButton from '../../General/MoreButton/MoreButton.component.js';

export default function GroupMembersBox({members, owner, onExpand, isExpanded, isLoadingMembers}) {

  // this is necessary to avoid modifying Redux state
  let membersCopy = members.slice();

  // mark owner and add to members
  owner.isOwner = true;
  membersCopy.unshift(owner);

  // if not expanded then show only the top 9 members
  let visibleMembers = (!isExpanded) ? membersCopy.slice(0, 9) : membersCopy;

  const memberImages = visibleMembers.map((member) => {
    const classes = 'member-image ' + ((typeof member.isOwner !== 'undefined') ? 'owner' : '');
    return <div key={member.id} className={classes}><img src={member.image || null} alt={member.displayName}/></div>;
  });

  const buttonText = (isExpanded) ? 'Vis færre' : 'Vis alle';

  // show MoreButton if there are more than 9 members
  let moreButton = null;
  if (membersCopy.length > 9) {
    moreButton = (
      <div className='members-button'>
        <MoreButton isLoading={isLoadingMembers} onClick={onExpand} text={buttonText}/>
      </div>
    );
  }


  return (
    <div className='group--sidebar'>
      <div className='group-view-members-box'>
        {memberImages}
      </div>
      {moreButton}
    </div>
  );
}

GroupMembersBox.propTypes = {
  onExpand: React.PropTypes.func.isRequired,
  isExpanded: React.PropTypes.bool.isRequired,
  members: React.PropTypes.array.isRequired,
  owner: React.PropTypes.object.isRequired
};
