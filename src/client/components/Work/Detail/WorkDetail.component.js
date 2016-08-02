/**
 * @file Display details and related buttons to a work
 */

import React from 'react';
import './WorkDetail.component.scss';

import MaterialButton from '../../General/MaterialButton/MaterialButton.component.js';
import ReviewButton from '../../Review/ReviewButton.js';
import BorrowButton from '../BorrowButton/BorrowButton.component';
import Icon from '../../General/Icon/Icon.component.js';

import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/book.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/game.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/music.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/film.svg';
import otherSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/group.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';

const displayTypeSvgs = {
  book: bookSvg,
  audiobook: audiobookSvg,
  game: gameSvg,
  music: musicSvg,
  movie: movieSvg,
  other: otherSvg
};

export class WorkDetail extends React.Component {

  render() {
    const coverUrl = this.props.coverUrl;
    const title = this.props.title;
    const titleSeries = this.props.titleSeries;
    const creator = this.props.creator;
    const displayType = (this.props.displayType in displayTypeSvgs) ? this.props.displayType : 'other'; // eslint-disable-line no-unused-vars

    const materialTypes = [];

    const materialTypeElements = materialTypes.map((materialType, i) => (
      <li key={i}><MaterialButton materialType={materialType} active={true}/></li>));

    const abstract = this.props.abstract;

    const profile = this.props.profile;
    let reviewButton;

    let titleSeriesQuery = titleSeries;
    if (titleSeriesQuery) {
      if (titleSeriesQuery.indexOf(' ; ') > 0) {
        titleSeriesQuery = titleSeriesQuery.substring(0, titleSeriesQuery.indexOf(' ; '));
      }
      titleSeriesQuery = encodeURIComponent(titleSeriesQuery.replace('&', ''));
    }

    // sd-566: tweak login requirements and button glyph when in full review view
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
          <Icon glyph={displayTypeSvgs[displayType]} className='work-detail--worktype-icon' width={36} height={36}/>
          <h2>{title}</h2>
          {
            titleSeries &&
            <span className="work-detail--title-series">
              <a href={'/find?q=' + titleSeriesQuery}>{titleSeries}</a>
            </span>
          }
          <span className='work-detail--subheader'>{creator}</span>
          <div className='work-detail--description'>
            {abstract}
          </div>

          <div className='work-detail--action-buttons'>
            {
              //  sd-566: Do not show borrow button when displaying own review in expanded mode (the user allready borrowed this)
              !this.props.ownReview && <BorrowButton
                collectionDetails={this.props.collectionDetails}
                collection={this.props.collection}
                workTitle={title}
                coverUrl={coverUrl}
                orderState={this.props.orderState}
                orderMaterialAction={this.props.orderMaterialAction}
                checkOrderPolicyAction={this.props.checkOrderPolicyAction}
                checkOrderPolicyResult={this.props.checkOrderPolicyResult}
                checkOrderPolicyDone={this.props.checkOrderPolicyDone}
                resetOrderState={this.props.resetOrderState}
                saveProfileAction={this.props.saveProfileAction}
                unselectLibraryFunction={this.props.unselectLibraryFunction}
                searchForLibraryAction={this.props.searchForLibraryAction}
                librarySearchResults={this.props.librarySearchResults}
                profile={this.props.profile}
                getWorkOnlineAccessAction={this.props.getWorkOnlineAccessAction}
              />
            }
            {reviewButton}
          </div>
        </div>

        <div className='work-detail--secondary'>
          {
            // sd-566: Do not show coverurls when displaying full reviews
            !this.props.fullReview && <div className='work-detail--large-cover'>
              <img src={coverUrl}/>
            </div>
          }

          <ul className='work-detail--material-types'>
            {materialTypeElements}
          </ul>
        </div>
      </div>
    );
  }
}

WorkDetail.displayName = 'WorkDetail';
WorkDetail.propTypes = {
  collectionDetails: React.PropTypes.array.isRequired,
  profile: React.PropTypes.object.isRequired,
  editText: React.PropTypes.string.isRequired,
  toggleReview: React.PropTypes.func.isRequired,
  abstract: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  creator: React.PropTypes.string.isRequired,
  titleSeries: React.PropTypes.string.isRequired,
  displayType: React.PropTypes.string.isRequired,
  collection: React.PropTypes.array.isRequired,
  coverUrl: React.PropTypes.string.isRequired,
  orderState: React.PropTypes.number,
  orderMaterialAction: React.PropTypes.func.isRequired,
  checkOrderPolicyAction: React.PropTypes.func.isRequired,
  checkOrderPolicyResult: React.PropTypes.object,
  checkOrderPolicyDone: React.PropTypes.bool,
  resetOrderState: React.PropTypes.func.isRequired,
  unselectLibraryFunction: React.PropTypes.func.isRequired,
  searchForLibraryAction: React.PropTypes.func.isRequired,
  saveProfileAction: React.PropTypes.func.isRequired,
  librarySearchResults: React.PropTypes.array.isRequired,
  fullReview: React.PropTypes.bool, // are we expanding the current review? (e.g. only one at the screen) sd-566
  ownReview: React.PropTypes.bool,   // is this the users own review sd-566
  getWorkOnlineAccessAction: React.PropTypes.func.isRequired // sd-554 : First hasOnlineAccess url if it exists
};

WorkDetail.defaultProps = {
  ownReview: false,
  fullReview: false
};
