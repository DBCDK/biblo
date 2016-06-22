import React from 'react';
import './scss/group-members-box.scss';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component.js';


function shuffle (array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export default function GroupMembersBox({members, owner, onExpand, isExpanded, isLoadingMembers}) {

  // this is necessary to avoid modifying Redux state
  let membersCopy = members.slice();

  membersCopy = shuffle(membersCopy); // github #43 . shuffle members randomly

  // mark owner and add to members
  owner.isOwner = true;
  membersCopy.unshift(owner);

  // if not expanded then show only the top 9 members
  let visibleMembers = (!isExpanded) ? membersCopy.slice(0, 9) : membersCopy;

  const memberImages = visibleMembers.map((member) => {
    const classes = 'member-image ' + ((typeof member.isOwner !== 'undefined') ? 'owner' : '');
    return <a href={'/profil/' + member.id} key={member.id} className={classes}><img src={member.image || '/no_profile.png'} alt={member.displayName}/></a>;
  });

  const buttonText = (isExpanded) ? 'Vis færre' : 'Vis alle';

  // show ExpandButton if there are more than 9 members
  let expandButton = null;
  if (membersCopy.length > 9) {
    expandButton = (
      <div className='members-button'>
        <ExpandButton isLoading={isLoadingMembers} onClick={onExpand} text={buttonText} />
      </div>
    );
  }

  return (
    <div className='group--sidebar'>
      <div className='group-view-members-box'>
        {memberImages}
      </div>
      {expandButton}
    </div>
  );
}

GroupMembersBox.propTypes = {
  onExpand: React.PropTypes.func.isRequired,
  isExpanded: React.PropTypes.bool.isRequired,
  members: React.PropTypes.array.isRequired,
  owner: React.PropTypes.object.isRequired,
  isLoadingMembers: React.PropTypes.bool
};
