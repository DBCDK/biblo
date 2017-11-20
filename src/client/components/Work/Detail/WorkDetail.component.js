/**
 * @file Display details and related buttons to a work
 */

import React from 'react';
import PropTypes from 'prop-types';
import equal from 'deep-equal';
import './WorkDetail.component.scss';

import {ReviewButton} from '../../Review/ReviewButton.js';
import BorrowButton from '../BorrowButton/BorrowButton.component';
import Icon from '../../General/Icon/Icon.component.js';

import {registerScrollSpy} from '../../../Utils/scrollspy';

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
  constructor() {
    super();

    this.workDetailRef = null;

    this.state = {
      displayTopBar: false
    };

    this.renderTopBar = this.renderTopBar.bind(this);
  }

  componentDidMount() {
    registerScrollSpy(this.workDetailRef, visible => this.setState({displayTopBar: !visible}));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.displayTopBar !== nextState.displayTopBar) {
      return true;
    }

    const props = [
      'bind',
      'fullTitle',
      'collectionDetails',
      'profile',
      'abstract',
      'title',
      'creator',
      'titleSeries',
      'descriptionSeries',
      'displayType',
      'collection',
      'coverUrl',
      'orderState',
      'checkAvailabilityResult',
      'checkAvailabilityDone',
      'librarySearchResults',
      'fullReview',
      'ownReview'
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
  renderBorrowerButton(
    collectionDetails,
    adjustedTitle,
    buttonIcon,
    buttonTitle,
    modalButtonTitle = 'Lån',
    itemDescription = '',
    type = 'physical'
  ) {
    if (collectionDetails.length === 0) {
      return '';
    }

    return (
      <div className="work-detail--button-wrapper">
        <BorrowButton
          {...this.props}
          {...{adjustedTitle, collectionDetails, buttonIcon, buttonTitle, modalButtonTitle, itemDescription, type}}
        />
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
    res = res.replace(/^[^A-Z0-9]+/gi, '');
    res = res.replace(/[^A-Z0-9]+$/gi, '');

    return res;
  }

  renderSeriesTitles(titles, descriptionSeries) {
    if (!titles) {
      return <span className="not--series" />;
    }

    return titles.map((titleSeries, key) => {
      const {consolidatedTitleSeries, consolidatedTitleSeriesQuery} = this.seriesReference(
        titleSeries,
        descriptionSeries
      );
      if (consolidatedTitleSeries) {
        return (
          <span className="work-detail--title-series" key={key}>
            <a key={`title-series--${consolidatedTitleSeries}`} href={'/find?serie=' + consolidatedTitleSeriesQuery}>
              {consolidatedTitleSeries}
            </a>
          </span>
        );
      }

      return <span key={`fail-${Date.now()}`} className="match--failed" />;
    });
  }

  renderTopBar() {
    let classes = 'work-detail--top-bar--container ';
    classes += this.state.displayTopBar ? 'present' : 'not-present';
    const {title, creator, coverUrl} = this.props;

    return (
      <div className={classes}>
        <div className="work-detail--top-bar--inner">
          <img src={coverUrl} />
          <div className="text-container">
            <p className="title">{title}</p>
            <p className="author">{creator}</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const bind = this.props.bind;
    const title = this.adjustTitle(this.props.title, this.props.fullTitle, bind, this.props.isMultivolume);
    const creator = this.props.creator;
    const displayType = this.props.displayType in displayTypeSvgs ? this.props.displayType : 'other'; // eslint-disable-line no-unused-vars

    const seriesTitles = this.renderSeriesTitles(this.props.titleSeries, this.props.descriptionSeries);
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
      <div className="work-detail" ref={workDetail => (this.workDetailRef = workDetail)}>
        {this.renderTopBar()}
        <div className="work-detail--main">
          <div className="work-detail--title-container">
            <h2 className="work-detail--title">
              <Icon
                glyph={displayTypeSvgs[displayType]}
                className="work-detail--worktype-icon"
                width={36}
                height={36}
              />
              {title}
            </h2>
            {this.props.isMultivolume && (
              <p className="work-detail--multi-volume--title">
                {this.props.title}: {bind}
              </p>
            )}
            {seriesTitles}
            <span className="work-detail--subheader">{creator}</span>
          </div>
          <div className="work-detail--description">{abstract}</div>

          <div className="work-detail--action-buttons">
            {this.renderBorrowerButton(physical, title, <Icon glyph={houseSvg} />, 'Lån på biblioteket')}
            {this.renderBorrowerButton(online, title, <Icon glyph={houseSvg} />, 'Lån online')}
            {this.renderBorrowerButton(
              ereolen,
              title,
              <Icon glyph={eReolenlogo} />,
              'Lån på eReolen GO',
              'Gå til eReolen GO',
              'Hør nu på eReolen',
              'online'
            )}
            {this.renderBorrowerButton(
              ereolen_ebooks,
              title,
              <Icon glyph={eReolenlogo} />,
              'Lån på eReolen GO',
              'Gå til eReolen GO',
              'Læs nu på eReolen',
              'online'
            )}
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
  bind: PropTypes.string,
  bindId: PropTypes.string,
  fullTitle: PropTypes.string.isRequired,
  isMultivolume: PropTypes.bool,
  collectionDetails: PropTypes.array.isRequired,
  profile: PropTypes.object.isRequired,
  editText: PropTypes.string.isRequired,
  toggleReview: PropTypes.func.isRequired,
  abstract: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  titleSeries: PropTypes.string.isRequired,
  descriptionSeries: PropTypes.string.isRequired,
  displayType: PropTypes.string.isRequired,
  collection: PropTypes.array.isRequired,
  coverUrl: PropTypes.string.isRequired,
  orderState: PropTypes.number,
  orderMaterialAction: PropTypes.func.isRequired,
  checkAvailabilityAction: PropTypes.func.isRequired,
  checkAvailabilityResult: PropTypes.object,
  checkAvailabilityDone: PropTypes.bool,
  resetOrderState: PropTypes.func.isRequired,
  unselectLibraryFunction: PropTypes.func.isRequired,
  searchForLibraryAction: PropTypes.func.isRequired,
  saveProfileAction: PropTypes.func.isRequired,
  librarySearchResults: PropTypes.array.isRequired,
  fullReview: PropTypes.bool,
  ownReview: PropTypes.bool,
  getWorkOnlineAccessAction: PropTypes.func.isRequired,
  bindDetails: PropTypes.object
};

WorkDetail.defaultProps = {
  ownReview: false,
  fullReview: false
};
