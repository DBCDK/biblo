/**
 * @file: This file contains the component used to render a campaign certificate from a users profile and a campaign.
 */

/* eslint-disable max-len */
/* eslint-disable react/no-danger */

import React, {Component, PropTypes} from 'react';
import {renderVideoGroupPost} from '../WidgetContainer/widgets/LatestGroupPostsWidget/CompactGroupPostElement.component';
import '../Groups/Posts/PostView.component';
import './scss/CampaignCertificate.component.scss';

export class CampaignCertificate extends Component {
  constructor(props) {
    super(props);

    this.getPageHeader.bind(this);
  }

  getPreloadedImages() {
    return (
      <div className="preload">
        <img src="/images/biblo_logo_godkendt-af.png"/>
      </div>
    );
  }

  getFirstPageHeader() {
    const styles = {
      width: '100%'
    };

    return (
      <div id="pageHeader-first">

      </div>
    );
  }

  getFirstPageFooter() {
    const styles = {
      display: 'block',
      margin: 'auto',
      height: '45px'
    };

    return (
      <div id="pageFooter-first">
        <img src="/images/biblo_logo_godkendt-af.png"/>
      </div>
    );
  }

  getPageHeader(profile, campaign, branchShortName) {
    const styles = <style>.emoji {'{width: 10px;}'}</style>;
    if (campaign.type === 'group') {
      return (
        <div id="pageHeader">
          {styles}
          Inlæg af <span dangerouslySetInnerHTML={{__html: profile.displayName}}/> fra {branchShortName}
        </div>
      );
    }

    return (
      <div id="pageHeader">
        {styles}
        <img src="file:///Users/svi/www/biblo/static/images/biblo_logo_godkendt-af.png"/>
        <img src={"http://localhost:8080" + profile.image.url.square}/>
        Anmeldelser af <span dangerouslySetInnerHTML={{__html: profile.displayName}}/> fra {branchShortName}
      </div>
    );
  }


  renderHeaderAndFooter(profile, branchShortName, baseurl, basepath) {
  console.log(`${basepath}/images/biblo_logo_godkendt-af.png`);
    return (
      <div>
        <div id="pageHeader-first">
        </div>
        <div id="pageHeader">
          <img className="profile-image" src={baseurl + profile.image.url.square}/>
          <span className="profile-name"><span dangerouslySetInnerHTML={{__html: profile.displayName}}/> fra {branchShortName}</span>
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

  renderGroupFrontPage(profile, campaign, branchShortName, contributions) {
    return (
      <div className="review-campaign--frontpage">
        <img src={`${baseurl}/images/biblo_logo_godkendt-af.png`}/>

        <img src={campaign.logos.medium} className="frontpage--campaign-logo"/>

        <h1>KAMPAGNEBEVIS</h1>
        <p>Biblo erklærer hermed at</p>

        <div className="frontpage--username">
          <img src={profile.img.url.small}/>
          <h3 dangerouslySetInnerHTML={{__html: profile.displayName}}/>
        </div>

        <p>har oprettet {contributions.group.postsCount} indlæg til {campaign.campaignName}</p>

        <div className="frontpage--biblo-approves--logo">
          <img src="/images/biblo_logo_godkendt-af.png"/>
        </div>
        <br />

        <table className="review-frontpage--person-data">
          <tbody>
          <tr className="first-row">
            <td>Navn</td>
            <td>{profile.fullName}</td>
            <td>Alder</td>
            <td>{profile.age || null}</td>
          </tr>
          <tr className="second-row">
            <td>Mail</td>
            <td>{profile.email}</td>
            <td>Skole</td>
            <td></td>
          </tr>
          <tr className="third-row">
            <td>Tlf.</td>
            <td>{profile.phone}</td>
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

  renderReviewFrontPage(profile, campaign, branchShortName, contributions) {
    //const imageStyle =

    return (
      <div className="review-campaign--frontpage">
        <div className="frontpage--header">

          <img src={campaign.logos.medium} className="frontpage--campaign-logo"/>

          <h1>Diplom</h1>
          <p>Biblo erklærer hermed at</p>

          <div className="profile">
            <div className="image" >
              <img src={profile.image.url.square}/>
            </div>
            <h3 className="name" dangerouslySetInnerHTML={{__html: profile.displayName}}/>
          </div>

          <div>har læst og anmeldt</div>
          <div className="material--count">
            {contributions.review.reviewsCount}
          </div>
          <div>bøger til {campaign.campaignName}</div>

          <div className="frontpage--biblo-approves--logo">
            <img src="/images/biblo_logo_godkendt-af.png"/>
          </div>
        </div>
        <table className="review-frontpage--person-data">
          <tbody>
          <tr className="first-row">
            <td>Navn</td>
            <td>{profile.fullName}</td>
            <td>Alder</td>
            <td>{profile.age}</td>
          </tr>
          <tr className="second-row">
            <td>Mail</td>
            <td>{profile.email}</td>
            <td>Skole</td>
            <td></td>
          </tr>
          <tr className="third-row">
            <td>Tlf.</td>
            <td>{profile.phone}</td>
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

  renderGroupContributions(contributions) {
    const posts = contributions.group.data;
    return posts.map(post => {
      const group = post.campaign.group;

      let postContent = <span dangerouslySetInnerHTML={{__html: post.html}}/>;

      if (post.video && post.video.resolutions) {
        postContent = renderVideoGroupPost(post);
      }
      else if (post.image) {
        postContent = <img src={post.image}/>;
      }

      const cDate = new Date(post.timeCreated);
      const dateString = `${cDate.getDate()}/${cDate.getMonth() + 1}/${cDate.getFullYear()}`;

      return (
        <div key={`post_${post.id}`} className="contribution--post-container">
          <div>
            <span dangerouslySetInnerHTML={{__html: group.name}}/>
            <span> d. {dateString} </span>
          </div>

          <div className="post--content">
            {postContent}
          </div>
        </div>
      );
    });
  }

  renderReviewContributions(contributions, works, campaign) {
    const reviews = contributions.review.data;
    return reviews.map(review => {
      const work = works[review.pid] || {};
      const creator = work.workType === 'book' ? `af ${work.creator}` : '';
      let reviewContent = <span dangerouslySetInnerHTML={{__html: review.html}}/>;

      if (review.video && review.video.resolutions) {
        reviewContent = renderVideoGroupPost(review);
      }
      else if (review.image) {
        reviewContent = <img src={review.image}/>;
      }

      const cDate = new Date(review.created);
      const dateString = `${cDate.getDate()}/${cDate.getMonth() + 1}/${cDate.getFullYear()}`;

      return (
        <div key={`review_${review.id}`} className="contribution">

          <div className="cover-image">
            <img src={work.coverUrl}/>
          </div>
          <div className="work">
            <span>{work.dcTitle} {creator}</span>
          </div>
          <div className="post--content">
            {reviewContent}
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
    const isGroupCampaign = campaign.type === 'group';
    const works = this.props.works;

    return (
      <div>
        {this.renderHeaderAndFooter(profile, branchShortName, baseurl, basepath)}

        {isGroupCampaign ?
          this.renderGroupFrontPage(profile, campaign, branchShortName, contributions) :
          this.renderReviewFrontPage(profile, campaign, branchShortName, contributions)}

        <div className="group-contributions">
          {this.renderGroupContributions(contributions, profile)}
        </div>

        <div className="review-contributions">
          {this.renderReviewContributions(contributions, works, campaign)}
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
  works: PropTypes.object.isRequired
};
