'use strict';

import React from 'react';
import PageLayout from '../../Layout/PageLayout.component.js';
import Follow from '../../General/Follow/Follow.component.js';
import GroupHeader from './GroupViewHeader.component.js';
import PostList from '../Posts/PostList.component.js';
import PostAdd from '../Posts/PostsAdd.component.js';

import './scss/group-view.scss';

export default class GroupViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      following: props.following || false
    };
  }

  render() {
    // Dummyimage is used until images can be saved on and retrieved from groups
    const dummyImage = 'http://lorempixel.com/200/200/';

    if (this.props.error) {
      return (
        <div className="error">{this.props.error}</div>
      );
    }
    return (
      <PageLayout>
        <div className='group' >
          <GroupHeader uri={dummyImage} />

          <div className='group--content' >
            <div className="details" >
              <h2 className='group--title' >{this.props.name}</h2>
              <p className='group--description' >{this.props.description}</p>
              <div className='group--follow' >
                <Follow active={this.state.following}
                        onClick={() => this.setState({following: !this.state.following})}
                        text={this.state.following && 'Følger' || 'Følg gruppen'} />
              </div>
            </div>
            <div className='group--post-add' >
              <h2>Skriv i gruppen</h2>
              <PostAdd profile={this.props.profile} groupId={this.props.id} />
            </div>
            <div className='group--post-view' >
              <h2>{this.props.posts.length} brugere skriver</h2>
              <PostList posts={this.props.posts} />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
}

GroupViewContainer.propTypes = {
  id: React.PropTypes.number,
  profile: React.PropTypes.object,
  error: React.PropTypes.string,
  name: React.PropTypes.string,
  description: React.PropTypes.string,
  posts: React.PropTypes.array,
  following: React.PropTypes.bool
};
