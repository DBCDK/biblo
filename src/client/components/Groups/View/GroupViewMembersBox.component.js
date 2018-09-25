import React from 'react';
import PropTypes from 'prop-types';
import './scss/group-members-box.scss';
import ExpandButton from '../../General/ExpandButton/ExpandButton.component.js';
import Icon from '../../General/Icon/Icon.component';
import minusSvg from '../../General/Icon/svg/functions/minus.svg';

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

    // mark owner and add to members
    const owner = Object.assign({}, props.owner, {isOwner: true});
    membersCopy.unshift(owner);
    this.setState({membersCopy});
  }

  setExpanded() {
    if (this.props.membersCount - 1 > this.state.membersCopy.length) {
      // all members minus the owner
      this.props.loadMembers();
    }
    const isExpanded = !this.state.isExpanded;
    this.setState({isExpanded});
  }

  render() {
    const {isLoadingMembers} = this.props;
    const membersCopy = this.state.membersCopy;

    // if not expanded then show only the top 9 members
    let visibleMembers = !this.state.isExpanded ? membersCopy.slice(0, 9) : membersCopy;

    const memberImages = visibleMembers.map(member => {
      const classes = 'member-image ' + (typeof member.isOwner !== 'undefined' ? 'owner' : '');
      return (
        <a href={'/profil/' + member.id} key={member.id} className={classes}>
          <img src={member.image || '/no_profile.png'} alt={member.displayName} />
        </a>
      );
    });

    const buttonText = this.state.isExpanded ? 'Vis færre' : 'Vis alle';

    let loadingMembersMessage = null;

    // show ExpandButton if there are more than 9 members
    let expandButton = null;
    if (this.props.membersCount > 9) {
      const icon = this.state.isExpanded && !isLoadingMembers ? <Icon glyph={minusSvg} /> : null;

      expandButton = (
        <div className="members-button">
          <ExpandButton
            isLoading={isLoadingMembers}
            onClick={this.setExpanded.bind(this)}
            text={buttonText}
            iconOverride={icon}
          />
        </div>
      );
    }

    return (
      <div className="group--sidebar">
        <div className="group-view-members-box">{memberImages}</div>
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
  isLoadingMembers: PropTypes.bool,
  loadMembers: PropTypes.func.isRequired,
  membersCount: PropTypes.number.isRequired
};
