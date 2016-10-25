/**
 * @file: Latest group posts widget renders an expandable row of compact post elements.
 */

// Libs
import React from 'react';
import {isEqual} from 'lodash';

// Components
import {AbstractWidget} from '../../AbstractWidget.component';
import {PaginationContainer} from '../../PaginationContainer.component';
import {CompactGroupPostElement} from './CompactGroupPostElement.component';

// Styles
import './scss/LatestGroupPosts.widget.component.scss';

export class LatestGroupPostsWidget extends AbstractWidget {
  constructor(props) {
    super(props);

    this.state = {
      postsOffset: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetReducerProp.
    return !isEqual(nextState, this.state) || !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp);
  }

  componentDidMount() {
    this.loadGroup();
    this.loadPosts(true);
  }

  loadGroup() {
    const groupId = this.props.widgetConfig.group;
    this.callServiceProvider('getGroup', {id: groupId});
  }

  loadPosts(first = false) {
    const groupId = this.props.widgetConfig.group;
    const postsToLoad = this.props.widgetConfig.postsToLoad;
    const offset = this.state.postsOffset;
    const group = this.props.widgetReducerProp.groups[groupId] || {};

    if (first || group.postsCount > offset) {
      this.callServiceProvider('getPosts', {id: groupId, skip: offset, limit: postsToLoad});
      this.setState({postsOffset: offset + postsToLoad});
    }
  }

  renderCompactReviewElements(widgetPosts) {
    return widgetPosts.map(post => {
      return (
        <CompactGroupPostElement key={`cpe-${post.id}`} post={post} />
      );
    });
  }

  renderCampaignLogo(widgetGroup) {
    const campaignLogoUrl = widgetGroup && widgetGroup.campaign && widgetGroup.campaign.logos && widgetGroup.campaign.logos.small || null;
    if (campaignLogoUrl) {
      return (
        <span className="widget--campaign-logo">
          <img src={campaignLogoUrl} />
        </span>
      );
    }

    return <span />;
  }

  render() {
    if (this.props.widgetReducerProp.isLoading) {
      return <span>Loading...</span>;
    }

    const groupId = this.props.widgetConfig.group;
    const widgetGroup = this.props.widgetReducerProp.groups[groupId];
    const widgetPosts = this.props.widgetReducerProp.posts[groupId] || [];

    const campaignLogo = this.renderCampaignLogo(widgetGroup);
    const compactReviewElements = this.renderCompactReviewElements(widgetPosts);

    return (
      <div className="latest-group-posts-widget">
        {campaignLogo}

        <PaginationContainer
          nextPageFunction={() => this.loadPosts()}
          pages={compactReviewElements}
          pageIncrements={this.props.widgetConfig.postsToLoad}
          lastPageIndex={widgetGroup.postsCount}
          genericLoading={false}
        />
      </div>
    );
  }
}

LatestGroupPostsWidget.displayName = 'LatestGroupPostsWidget';
