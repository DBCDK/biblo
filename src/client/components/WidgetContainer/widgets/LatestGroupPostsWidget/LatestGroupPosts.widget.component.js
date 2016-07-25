/**
 * @file: Latest group posts widget renders an expandable row of compact post elements.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import VisibilitySensor from 'react-visibility-sensor';

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

  componentDidMount() {
    this.loadGroup();
    this.loadPosts();
  }

  loadGroup() {
    const groupId = this.props.widgetConfig.group;
    this.callServiceProvider('getGroup', {id: groupId});
  }

  loadPosts() {
    const groupId = this.props.widgetConfig.group;
    const postsToLoad = this.props.widgetConfig.postsToLoad;
    const offset = this.state.postsOffset;
    this.callServiceProvider('getPosts', {id: groupId, skip: offset, limit: postsToLoad});
    this.setState({postsOffset: offset + postsToLoad});
  }

  render() {
    if (this.props.widgetReducerProp.isLoading) {
      return <span>Loading...</span>
    }

    const groupId = this.props.widgetConfig.group;
    const widgetGroup = this.props.widgetReducerProp.groups[groupId];
    const widgetPosts = this.props.widgetReducerProp.posts[groupId] || [];
    const shouldDisplayShowMoreButton = widgetPosts.length < widgetGroup.postsCount;

    let showMoreButtonClasses = 'latest-group-posts-widget--show-more-button';
    if (!shouldDisplayShowMoreButton) {
      showMoreButtonClasses += ' hidden';
    }

    const campaignLogoUrl = widgetGroup.campaign && widgetGroup.campaign.logos && widgetGroup.campaign.logos.small || null;
    let campaignLogo = '';
    if (campaignLogoUrl) {
      campaignLogo = (
        <span className="latest-group-posts-widget--campaign-logo">
          <img src={campaignLogoUrl} />
        </span>
      );
    }

    let compactReviewElements = widgetPosts.map(post => {
      return (
        <CompactGroupPostElement key={`cpe-${post.id}`} post={post} />
      );
    });

    compactReviewElements.splice(
      compactReviewElements.length - 1,
      0,
      <span className="waypoint" key="vis">
        <VisibilitySensor onChange={(vis) => (vis && this.loadPosts())} />
      </span>
    );

    return (
      <div className="latest-group-posts-widget">
        {campaignLogo}
        <div className="latest-group-posts--container">
          {compactReviewElements}
        </div>
        <div className="latest-group-posts-widget--show-more-button--container">
          <a className={showMoreButtonClasses} onClick={() => this.loadPosts()}>
            <Icon glyph={plusSvg}/> VIS FLERE
          </a>
          <hr />
        </div>
      </div>
    );
  }
}

LatestGroupPostsWidget.displayName = 'LatestGroupPostsWidget';
