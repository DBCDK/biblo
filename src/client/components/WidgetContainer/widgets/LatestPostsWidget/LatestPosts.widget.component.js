/**
 * @file: A widget to display the latest posts across groups.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';

import {PaginationContainer} from '../../PaginationContainer.component';
import {CompactGroupPostElement} from '../LatestGroupPostsWidget/CompactGroupPostElement.component';

import './scss/LatestPosts.widget.component.scss';

export class LatestPostsWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.getNextPage = this.getNextPage.bind(this);
  }

  componentDidMount() {
    // Start by getting the posts.
    this.getNextPage(0);
  }

  getNextPage(page) {
    const load = this.props.widgetConfig.postsToLoad || 15;
    this.callServiceProvider('getLatestPosts', {
      skip: page * (load),
      limit: load
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
    );
  }

  render() {
    let loading = '';
    if (this.props.widgetReducerProp.postsLoading) {
      return <span>Indlæser...</span>;
    }

    const load = this.props.widgetConfig.postsToLoad || 15;
    const posts = this.props.widgetReducerProp.posts.map(this.renderPost);

    return (
      <div className="latest-post--container">
        <PaginationContainer nextPageFunction={this.getNextPage} pages={posts} pageIncrements={load}/>

        {loading}
      </div>
    );
  }
}

LatestPostsWidget.displayName = 'LatestPostsWidget';
