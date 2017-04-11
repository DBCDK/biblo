/**
 * @file Display details and related buttons to a work
 */

import React from 'react';
import equal from 'deep-equal';
import './WorkDetail.component.scss';

import {ReviewButton} from '../../Review/ReviewButton.js';
import BorrowButton from '../BorrowButton/BorrowButton.component';
import Icon from '../../General/Icon/Icon.component.js';

import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/book.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/game.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/music.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/film.svg';
import movieSvgNoBorder from '../../General/Icon/svg/Materialikon-kvadrat-small/film_no_border.svg';
import otherSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/other.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';
import houseSvg from '../../General/Icon/svg/functions/house.svg';
import eReolenlogo from '../../General/Icon/svg/functions/eReolenlogo.svg';

const displayTypeSvgs = {
  book: bookSvg,
  audiobook: audiobookSvg,
  game: gameSvg,
  music: musicSvg,
  movie: movieSvg,
  other: otherSvg
};

export class WorkDetail extends React.Component {
  shouldComponentUpdate(nextProps) {
    const props = [
      'bind', 'fullTitle', 'collectionDetails', 'profile', 'abstract', 'title', 'creator', 'titleSeries',
      'descriptionSeries', 'displayType', 'collection', 'coverUrl', 'orderState', 'checkAvailabilityResult',
      'checkAvailabilityDone', 'librarySearchResults', 'fullReview', 'ownReview'
    ];

    let shouldRender = false;
    props.forEach(prop => {
      if (typeof this.props[prop] === 'object' && !equal(this.props[prop], nextProps[prop])) {
        shouldRender = true;
        return shouldRender;
      }
      else if (this.props[prop] !== nextProps[prop]) {
        shouldRender = true;
        return shouldRender;
      }
    });

    return shouldRender;
  }

  clipTailOnMatch(text, match) {
    if (text.indexOf(match) > 0) {
      return text.substring(0, text.indexOf(match));
    }
    return text;
  }

  seriesReference(titleSeries, descriptionSeries) {
    let query = '';
    let title;
    if (titleSeries) {
      query = title = titleSeries;
    }
    else if (descriptionSeries) {
      query = title = descriptionSeries;
      if (query.indexOf(': ') > 0) {
        query = query.substring(query.indexOf(': ') + 2);
      }
      title = this.clipTailOnMatch(title, ' ; ');
      title = title.replace('Samhørende:', '1. del af:');
    }
    query = this.clipTailOnMatch(query, ' ; ');
    query = encodeURIComponent(query.replace('&', ''));
    return {consolidatedTitleSeries: title, consolidatedTitleSeriesQuery: query};
  }

  /**
   * Split an array of collectionsDetails into an online and physical materials
   *
   * @param collectionDetails
   * @returns {{physical: Array, online: Array}}
   */
  splitByAccessType(collectionDetails) {
    const physical = [];
    const ereolen = [];
    const ereolen_ebooks = [];
    const filmstriben = [];
    const online = [];

    collectionDetails.forEach(collection => {
      if (collection.accessType[0] === 'online') {
        if (collection.workType[0] === 'audiobook') {
          ereolen.push(collection);
        }
        else if (collection.workType[0] === 'book') {
          ereolen_ebooks.push(collection);
        }
        else if (collection.workType[0] === 'movie') {
          filmstriben.push(collection);
        }
        else {
          online.push(collection);
        }
      }
      else {
        physical.push(collection);
      }
    });

    return {physical, online, ereolen, ereolen_ebooks, filmstriben};
  }

  /**
   * Render a button for loans
   *
   * @param collectionDetails
   * @param buttonIcon
   * @param buttonTitle
   * @param modalButtonTitle
   * @param itemDescription
   * @param type
   * @returns {*}
   */
  renderBorrowerButton(collectionDetails, adjustedTitle, buttonIcon, buttonTitle, modalButtonTitle = 'Lån', itemDescription = '', type = 'physical') {
    if (this.props.ownReview || collectionDetails.length === 0) {
      return '';
    }

    return (
      <div className="work-detail--button-wrapper">
        <BorrowButton {...this.props} {...{adjustedTitle, collectionDetails, buttonIcon, buttonTitle, modalButtonTitle, itemDescription, type}} />
      </div>
    );
  }

  /**
   * Manipulates the book title based on pre determined rules.
   * Currently only manipulates multivolume titles.
   * @param {String}title - dcTitle
   * @param {String}titleFull - dcTitleFull
   * @param {String}displayType´
   * @param {Boolean}isMultivolume
   * @returns {String}
   */
  adjustTitle(title, titleFull, bind, isMultivolume) {
    if (!isMultivolume) {
      return title;
    }

    // Get required info
    const lTitle = title.toLowerCase();
    const lTitleFull = titleFull.toLowerCase();

    // Start with dcTitleFull
    let lRes = lTitleFull;
    let res = titleFull;

    // Remove the multivolume title
    res = res.slice(lRes.indexOf(lTitle) + lTitle.length);
    lRes = lRes.slice(lRes.indexOf(lTitle) + lTitle.length);

    // Remove volume indicator
    res = res.slice(lRes.indexOf(bind) + bind.length);
    lRes = lRes.slice(lRes.indexOf(bind) + bind.length);

    // Strip special chars and spaces from beginning and end.
    res = res.replace(/^[^A-Z0-9]+/ig, '');
    res = res.replace(/[^A-Z0-9]+$/ig, '');

    return res;
  }

  render() {
    const bind = this.props.bind;
    const title = this.adjustTitle(this.props.title, this.props.fullTitle, bind, this.props.isMultivolume);
    const creator = this.props.creator;
    const displayType = (this.props.displayType in displayTypeSvgs) ? this.props.displayType : 'other'; // eslint-disable-line no-unused-vars

    const {consolidatedTitleSeries, consolidatedTitleSeriesQuery} = this.seriesReference(this.props.titleSeries, this.props.descriptionSeries);
    const abstract = this.props.abstract;

    const profile = this.props.profile;
    let reviewButton;

    let collectionDetails = this.props.collectionDetails;
    if (this.props.isMultivolume && this.props.bindDetails) {
      collectionDetails = collectionDetails.filter(coll => {
        return this.props.bindDetails.pid.indexOf(coll.pid[0]) >= 0;
      });
    }

    const {physical, online, ereolen, ereolen_ebooks, filmstriben} = this.splitByAccessType(collectionDetails);
    if (this.props.fullReview) {
      reviewButton = (
        <ReviewButton
          editText={this.props.editText}
          loginRequired={false}
          clickFunction={this.props.toggleReview.bind(this)}
          profile={profile}
        />
      );
    }
    else {
      reviewButton = (
        <ReviewButton
          editText={this.props.editText}
          glyph={pencilSvg}
          loginRequired={true}
          clickFunction={this.props.toggleReview.bind(this)}
          profile={profile}
        />
      );
    }

    return (
      <div className='work-detail'>
        <div className='work-detail--main'>
          <div className="work-detail--title-container">
            <h2 className='work-detail--title'>
              <Icon glyph={displayTypeSvgs[displayType]} className='work-detail--worktype-icon' width={36} height={36}/>
              {title}
            </h2>
            {
              this.props.isMultivolume &&
              <p className="work-detail--multi-volume--title">{this.props.title}: {bind}</p>
            }
            {
              consolidatedTitleSeries &&
              <span className="work-detail--title-series">
                <a href={'/find?q=' + consolidatedTitleSeriesQuery}>{consolidatedTitleSeries}</a>
              </span>
            }
            <span className='work-detail--subheader'>{creator}</span>
          </div>
          <div className='work-detail--description'>
            {abstract}
          </div>

          <div className='work-detail--action-buttons'>
            {this.renderBorrowerButton(physical, title, <Icon glyph={houseSvg} />, 'Lån på biblioteket')}
            {this.renderBorrowerButton(online, title, <Icon glyph={houseSvg} />, 'Lån online')}
            {this.renderBorrowerButton(ereolen, title, <Icon glyph={eReolenlogo} />, 'Lån på eReolen GO', 'Gå til eReolen GO', 'Hør nu på eReolen', 'online')}
            {this.renderBorrowerButton(ereolen_ebooks, title, <Icon glyph={eReolenlogo} />, 'Lån på eReolen GO', 'Gå til eReolen GO', 'Læs nu på eReolen', 'online')}
            {this.renderBorrowerButton(
              filmstriben,
              <Icon glyph={movieSvgNoBorder} width={24} height={24} />,
              'Lån på filmstriben',
              'Gå til filmstriben',
              'Se nu på filmstriben',
              'online'
            )}
            <div className="work-detail--button-wrapper">{reviewButton}</div>
          </div>
        </div>
      </div>
    );
  }
}

WorkDetail.displayName = 'WorkDetail';
WorkDetail.propTypes = {
  bind: React.PropTypes.string,
  bindId: React.PropTypes.string,
  fullTitle: React.PropTypes.string.isRequired,
  isMultivolume: React.PropTypes.bool,
  collectionDetails: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired,
  editText: React.PropTypes.string.isRequired,
  toggleReview: React.PropTypes.func.isRequired,
  abstract: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  creator: React.PropTypes.string.isRequired,
  titleSeries: React.PropTypes.string.isRequired,
  descriptionSeries: React.PropTypes.string.isRequired,
  displayType: React.PropTypes.string.isRequired,
  collection: React.PropTypes.array.isRequired,
  coverUrl: React.PropTypes.string.isRequired,
  orderState: React.PropTypes.number,
  orderMaterialAction: React.PropTypes.func.isRequired,
  checkAvailabilityAction: React.PropTypes.func.isRequired,
  checkAvailabilityResult: React.PropTypes.object,
  checkAvailabilityDone: React.PropTypes.bool,
  resetOrderState: React.PropTypes.func.isRequired,
  unselectLibraryFunction: React.PropTypes.func.isRequired,
  searchForLibraryAction: React.PropTypes.func.isRequired,
  saveProfileAction: React.PropTypes.func.isRequired,
  librarySearchResults: React.PropTypes.array.isRequired,
  fullReview: React.PropTypes.bool,
  ownReview: React.PropTypes.bool,
  getWorkOnlineAccessAction: React.PropTypes.func.isRequired,
  bindDetails: React.PropTypes.object
};

WorkDetail.defaultProps = {
  ownReview: false,
  fullReview: false
};
