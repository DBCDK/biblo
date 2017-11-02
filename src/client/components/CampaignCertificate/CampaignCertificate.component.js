/**
 * @file: This file contains the component used to render a campaign certificate from a users profile and a campaign.
 */

/* eslint-disable max-len */
/* eslint-disable react/no-danger */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {renderVideoGroupPost} from '../WidgetContainer/widgets/LatestGroupPostsWidget/CompactGroupPostElement.component';
import '../Groups/Posts/PostView.component';
import './scss/CampaignCertificate.component.scss';
import Rating from '../General/Rating/Rating.component';
import DOMPurify from 'dompurify';

export class CampaignCertificate extends Component {
  constructor(props) {
    super(props);
  }

  renderHeaderAndFooter(profile, branchShortName, type, baseurl, basepath) {
    const displayname = typeof window !== 'undefined' ? DOMPurify.sanitize(profile.displayName) : '';

    return (
      <div>
        <div id="pageHeader-first">
        </div>
        <div id="pageHeader">
          {type !== 'group' && <img className="profile-image" src={baseurl + profile.image.url.square}/> || ''}
          <span className="profile-name"><span
            dangerouslySetInnerHTML={{__html: displayname}}/> fra {branchShortName}</span>
        </div>
        <div id="pageFooter">
          <img src={`${basepath}/static/images/biblo_logo_læs-løspå-biblo.png`}/>
        </div>
        <div id="pageFooter-first">
          <img src={`${basepath}/static/images/biblo_logo_portrait.png`}/>
        </div>
      </div>
    );
  }

  renderFrontPage(profile, campaign, branchShortName, contributions) {
    const dimplomaText = campaign.type === 'group' && 'bidrag til' || 'anmeldelser til';
    const displayname = typeof window !== 'undefined' ? DOMPurify.sanitize(profile.displayName) : '';

    return (
      <div className="frontpage">
        <div className="frontpage--header">

          <img src={campaign.logos.medium} className="frontpage--campaign-logo"/>

          <h1>Diplom</h1>
          <p>Biblo erklærer hermed at</p>

          <div className="profile">
            <div className="image">
              <img src={profile.image.url.square}/>
            </div>
            <h3 className="name" dangerouslySetInnerHTML={{__html: displayname}}/>
          </div>
          <div>har lavet</div>
          <div className="count">
            {campaign.type === 'group' && contributions.group.postsCount || contributions.review.reviewsCount}
          </div>
          <div>{dimplomaText} {campaign.campaignName}</div>
          <div className="frontpage--biblo-approves-logo">
            <img src="/images/biblo_logo_godkendt-af.png"/>
          </div>
        </div>
        <table className="frontpage--person-data">
          <tbody>
          <tr className="first-row">
            <td>Navn</td>
            <td>{profile.fullName}</td>
            <td>Alder</td>
            <td>{profile.age || ''}</td>
          </tr>
          <tr className="second-row">
            <td>Mail</td>
            <td>{profile.email || ''}</td>
            <td>Skole</td>
            <td></td>
          </tr>
          <tr className="third-row">
            <td>Tlf.</td>
            <td>{profile.phone || ''}</td>
            <td>Klasse</td>
            <td></td>
          </tr>
          <tr className="fourth-row">
            <td>By</td>
            <td></td>
            <td>Bibliotek</td>
            <td>{branchShortName}</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderContributionContent(contribution) {
    const contributionHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(contribution.html) : '';
    let content = (<span dangerouslySetInnerHTML={{__html: contributionHtml}}/>);

    if (contribution.video && contribution.video.resolutions) {
      content = (
        <div className="video-image--wrapper">
          {renderVideoGroupPost(contribution)}
          <img className="overlay" src="/images/video_thumbnail_overlay.png"/>
        </div>);
    }
    else if (contribution.image) {
      content = (<img src={contribution.image}/>);
    }

    return content;
  }

  renderGroupContributions(contributions, campaign, profile) {
    const posts = contributions.group.data;
    return posts.map((post, key) => {
      const group = post.campaign.group;

      const cDate = new Date(post.timeCreated || Date.now());
      const dateString = `${cDate.getDate()}/${cDate.getMonth() + 1}/${cDate.getFullYear()}`;
      const groupName = typeof window !== 'undefined' ? DOMPurify.sanitize(group.name) : '';

      return (
        <div key={`post_${post.id}`} className="contribution">
          <h3 className="contribution--key">{key + 1}.</h3>
          <div className="post--profile">
            <img className="profile-image" src={profile.image.url.square}/>
          </div>
          <div className="post--header">
            <h3>Indlæg i <span className="group--title" dangerouslySetInnerHTML={{__html: groupName}}/></h3>
            <div className="post--date">{dateString}</div>
          </div>

          <div className="post--content">
            {this.renderContributionContent(post)}
          </div>
          <div className="campaign-logo">
            <img src={campaign.logos.medium}/>
          </div>
        </div>
      );
    });
  }

  renderReviewContributions(contributions, campaign, works) {
    const reviews = contributions.review.data;
    return reviews.map((review, key) => {
      const work = works[review.pid] || {};
      const creator = work.workType === 'book' ? `${work.creator}` : '';
      return (
        <div key={`review_${review.id}`} className="contribution">
          <h3 className="contribution--key">{key + 1}.</h3>
          <div className="cover-image">
            <img src={work.coverUrl}/>
          </div>
          <div className="work">
            <h3 className="work--title">{work.dcTitle}</h3>
            <div className="work--creator">{creator}</div>
            <Rating rating={review.rating}/>
          </div>
          <div className="post--content">
            {this.renderContributionContent(review)}
          </div>
          <div className="campaign-logo">
            <img src={campaign.logos.medium}/>
          </div>
        </div>
      );
    });
  }

  render() {
    const baseurl = this.props.baseurl;
    const basepath = this.props.basepath;
    const profile = this.props.profile;
    const campaign = this.props.campaign;
    const library = this.props.library;
    const contributions = this.props.contributions;
    const branchShortName = (Array.isArray(library.branchShortName) ? library.branchShortName[0] : library.branchShortName).$value;
    const works = this.props.works;

    return (
      <div>
        {this.renderHeaderAndFooter(profile, branchShortName, campaign.type, baseurl, basepath)}
        {this.renderFrontPage(profile, campaign, branchShortName, contributions)}

        <div className="group-contributions">
          {this.renderGroupContributions(contributions, campaign, profile)}
        </div>

        <div className="review-contributions">
          {this.renderReviewContributions(contributions, campaign, works)}
        </div>
      </div>
    );
  }
}

CampaignCertificate.displayName = 'CampaignCertificate';
CampaignCertificate.propTypes = {
  campaign: PropTypes.object.isRequired,
  contributions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  library: PropTypes.object.isRequired,
  works: PropTypes.object.isRequired,
  baseurl: PropTypes.string.isRequired,
  basepath: PropTypes.string.isRequired
};
