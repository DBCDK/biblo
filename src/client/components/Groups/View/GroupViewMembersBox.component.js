import React from 'react';
import PropTypes from 'prop-types';
import './scss/group-members-box.scss';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component.js';
import Icon from '../../General/Icon/Icon.component';
import spinnerSvg from './../../General/Icon/svg/spinners/loading-spin.svg';

function shuffle(array) {
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

export default class GroupMembersBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      membersCopy: []
    };
  }

  componentDidMount() {
    this.setMembers(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setMembers(nextProps);
  }

  setMembers(props) {
    let membersCopy = props.members.slice();
    membersCopy = shuffle(membersCopy);

    // mark owner and add to members
    const owner = Object.assign({}, props.owner, {isOwner: true});
    membersCopy.unshift(owner);
    this.setState({membersCopy});
  }

  setExpanded() {
    const isExpanded = !this.state.isExpanded;
    this.setState({isExpanded});
  }

  render() {
    const {isLoadingMembers} = this.props;
    const membersCopy = this.state.membersCopy;

    // if not expanded then show only the top 9 members
    let visibleMembers = (!this.state.isExpanded) ? membersCopy.slice(0, 9) : membersCopy;

    const memberImages = visibleMembers.map((member) => {
      const classes = 'member-image ' + ((typeof member.isOwner !== 'undefined') ? 'owner' : '');
      return <a href={'/profil/' + member.id} key={member.id} className={classes}><img src={member.image || '/no_profile.png'} alt={member.displayName} /></a>;
    });

    const buttonText = (this.state.isExpanded) ? 'Vis færre' : 'Vis alle';

    let loadingMembersMessage = null;
    if (isLoadingMembers) {
      loadingMembersMessage = <Icon glyph={spinnerSvg} />;
    }

    // show ExpandButton if there are more than 9 members
    let expandButton = null;
    if (membersCopy.length > 9) {
      expandButton = (
        <div className='members-button'>
          <ExpandButton isLoading={isLoadingMembers} onClick={this.setExpanded.bind(this)} text={buttonText} />
        </div>
      );
    }

    return (
      <div className='group--sidebar'>
        <div className='group-view-members-box'>
          {memberImages}
        </div>
        {expandButton}
        {loadingMembersMessage}
      </div>
    );
  }
}

GroupMembersBox.displayName = 'GroupMembersBox';
GroupMembersBox.propTypes = {
  members: PropTypes.array.isRequired,
  owner: PropTypes.object.isRequired,
  isLoadingMembers: PropTypes.bool
};
