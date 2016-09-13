/**
 * @file: A widget to display the latest posts across groups.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';

import {CompactGroupPostElement} from '../LatestGroupPostsWidget/CompactGroupPostElement.component';
import Icon from '../../../General/Icon/Icon.component';

import plusSvg from '../../../General/Icon/svg/functions/plus.svg';
import minusSvg from '../../../General/Icon/svg/functions/minus.svg';

import './scss/LatestPosts.widget.component.scss';

export class LatestPostsWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.state = {
      postsExpanded: false
    };

    this.renderShowMoreButton.bind(this);
  }

  componentDidMount() {
    // Start by getting the posts.
    this.callServiceProvider('getLatestPosts', {
      skip: 0,
      limit: this.props.widgetConfig.postsToLoad || 15
    });
  }

  renderPost(post) {
    return (
      <CompactGroupPostElement
        post={post}
        key={`lp-cpe-${post.id}`}
        groupName={post.group.name}
        groupHref={`/grupper/${post.group.id}`}
        elementHref={`/grupper/post/${post.id}`}
      />
    )
  }

  renderShowMoreButton() {
    const exp = this.state.postsExpanded;
    return (
      <div className="latests-posts-show-more-button--container">
        <a onClick={() => this.setState({postsExpanded: !exp})}><Icon glyph={exp ? minusSvg : plusSvg} /> {exp ? 'VIS FÆRRE' : 'VIS FLERE'}</a>
        <hr />
      </div>
    );
  }

  render() {
    if (this.props.widgetReducerProp.postsLoading) {
      return <span>Indlæser...</span>
    }

    const postsToLoad = this.state.postsExpanded ? this.props.widgetConfig.postsToLoad || 15 : 3;
    const posts = this.props.widgetReducerProp.posts.slice(0, postsToLoad).map(this.renderPost);
    const showMore = this.renderShowMoreButton();

    return (
      <div className="">
        {posts}
        {showMore}
      </div>
    );
  }
}

LatestPostsWidget.displayName = 'LatestPostsWidget';
