'use strict';

import React from 'react';
import {connect} from 'react-redux';

import PageLayout from '../../Layout/PageLayout.component.js';
import Follow from '../../General/Follow/Follow.component.js';
import GroupHeader from './GroupViewHeader.component.js';
import PostList from '../Posts/PostList.component.js';
import PostAdd from '../AddContent/AddContent.component';

import './scss/group-view.scss';

export class GroupViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      following: props.following || false
    };
  }

  render() {
    if (this.props.group.error) {
      return (
        <PageLayout>
          <div className="error" >{this.props.group.error}</div>
        </PageLayout>
      );
    }
    return (
      <PageLayout>
        <div className='group' >
          <GroupHeader uri={this.props.group.image} />

          <div className='group--content' >
            <div className="details" >
              <h2 className='group--title' >{this.props.group.name}</h2>

              <p className='group--description' >{this.props.group.description}</p>

              <div className='group--follow' >
                <Follow active={this.state.following}
                        onClick={() => this.setState({following: !this.state.following})}
                        text={this.state.following && 'Følger' || 'Følg gruppen'} />
              </div>
            </div>
            <div className='group--post-add' >
              <h2>Skriv i gruppen</h2>
              <PostAdd redirectTo={`/grupper/${this.props.group.id}`} profile={this.props.profile} parentId={this.props.group.id} type="post" />
            </div>
            <div className='group--post-view' >
              <h2>{this.props.group.posts.length} {this.props.group.posts.length === 1 && 'bruger skriver' || 'brugere skriver'}</h2>
              <PostList posts={this.props.group.posts} profile={this.props.profile} groupId={this.props.group.id} />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
}

GroupViewContainer.propTypes = {
  id: React.PropTypes.number,
  profile: React.PropTypes.object.isRequired,
  group: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  following: React.PropTypes.bool
};


/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profile: state.profileReducer,
      group: state.groupViewReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => { // eslint-disable-line no-unused-vars
    return {};
  }
)(GroupViewContainer);
