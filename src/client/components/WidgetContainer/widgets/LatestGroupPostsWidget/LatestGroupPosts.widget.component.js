/**
 * @file: Latest group posts widget renders an expandable row of compact post elements.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import VisibilitySensor from 'react-visibility-sensor';
import {isEqual} from 'lodash';

import {CompactGroupPostElement} from './CompactGroupPostElement.component';
import Icon from '../../../General/Icon/Icon.component';

import plusSvg from '../../../General/Icon/svg/functions/plus.svg';

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
    let elements = widgetPosts.map(post => {
      return (
        <CompactGroupPostElement key={`cpe-${post.id}`} post={post} />
      );
    });

    let width = 700;
    if (typeof window !== 'undefined') {
      width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    if (width < 600) {
      elements.splice(
        elements.length - 1,
        0,
        <VisibilitySensor onChange={(vis) => (vis && this.loadPosts())} delayedCall={true}/>
      );
    }

    return (
      <div className="latest-group-posts--container">
        {elements}
      </div>
    );
  }

  renderCampaignLogo(widgetGroup) {
    const campaignLogoUrl = widgetGroup.campaign && widgetGroup.campaign.logos && widgetGroup.campaign.logos.small || null;
    if (campaignLogoUrl) {
      return (
        <span className="latest-group-posts-widget--campaign-logo">
          <img src={campaignLogoUrl} />
        </span>
      );
    }

    return <span />;
  }

  renderShowMoreButton(shouldDisplayShowMoreButton) {
    let showMoreButtonClasses = 'latest-group-posts-widget--show-more-button';
    if (!shouldDisplayShowMoreButton) {
      showMoreButtonClasses += ' hidden';
    }

    return (
      <div className="latest-group-posts-widget--show-more-button--container">
        <a className={showMoreButtonClasses} onClick={() => this.loadPosts()}>
          <Icon glyph={plusSvg}/> VIS FLERE
        </a>
        <hr />
      </div>
    );
  }

  render() {
    if (this.props.widgetReducerProp.isLoading) {
      return <span>Loading...</span>;
    }

    const groupId = this.props.widgetConfig.group;
    const widgetGroup = this.props.widgetReducerProp.groups[groupId];
    const widgetPosts = this.props.widgetReducerProp.posts[groupId] || [];
    const shouldDisplayShowMoreButton = widgetPosts.length < widgetGroup.postsCount;

    const showMoreButton = this.renderShowMoreButton(shouldDisplayShowMoreButton);
    const campaignLogo = this.renderCampaignLogo(widgetGroup);
    const compactReviewElements = this.renderCompactReviewElements(widgetPosts);

    return (
      <div className="latest-group-posts-widget">
        {campaignLogo}
        {compactReviewElements}
        {showMoreButton}
      </div>
    );
  }
}

LatestGroupPostsWidget.displayName = 'LatestGroupPostsWidget';
