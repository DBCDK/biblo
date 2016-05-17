/**
 * @file: Compact review view component. Originally created to display reviews on the front page.
 */

import {Component, PropTypes} from 'react';

import Rating from '../../../General/Rating/Rating.component';
import Icon from '../../../General/Icon/Icon.component';

import animalpaw from '../../../General/Icon/svg/Materialikon-kvadrat small/animalpaw.svg';
import audiobook from '../../../General/Icon/svg/Materialikon-kvadrat small/audiobook_no_border.svg';
import book from '../../../General/Icon/svg/Materialikon-kvadrat small/book_no_border.svg';
import ebook from '../../../General/Icon/svg/Materialikon-kvadrat small/ebook_no_border.svg';
import film from '../../../General/Icon/svg/Materialikon-kvadrat small/film_no_border.svg';
import flag from '../../../General/Icon/svg/Materialikon-kvadrat small/flag.svg';
import game from '../../../General/Icon/svg/Materialikon-kvadrat small/game_no_border.svg';
import group from '../../../General/Icon/svg/Materialikon-kvadrat small/group.svg';
import music from '../../../General/Icon/svg/Materialikon-kvadrat small/music_no_border.svg';
import photo from '../../../General/Icon/svg/Materialikon-kvadrat small/photo.svg';
import smiley from '../../../General/Icon/svg/Materialikon-kvadrat small/smiley.svg';

import './scss/CompactReviewElement.component.scss';

const materialSvgs = {
  animalpaw,
  audiobook,
  book,
  literature: book,
  ebook,
  film,
  flag,
  game,
  group,
  music,
  photo,
  smiley
};

export class CompactReviewElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderTextReview.bind(this);
    this.renderVideoReview.bind(this);
  }

  componentDidMount() {
    this.props.getCoverImageAction(this.props.review.pid);
  }

  getTextContent(html) {
    let htmlContent = html.slice(0, 50).trim();
    if (html.length > 50) {
      htmlContent += '...';
    }

    /* eslint-disable react/no-danger */
    return (
      <div className="compact-review-element--text-excerpt" dangerouslySetInnerHTML={{__html: htmlContent}}></div>
    );
    /* eslint-enable react/no-danger */
  }

  renderTextReview(review, ownerProfileUrl, workUrl) {
    return (
      <div className="compact-review--container">
        <p>Anmeldelse af: <a href={ownerProfileUrl}>{review.owner.displayName}</a></p>
        <table>
          <tbody>
          <tr>
            <td className="compact-review--artwork--container">
              <a href={ownerProfileUrl} className="compact-review--owner-image--container">
                <img src={review.owner.image}/>
              </a>
              <a href={workUrl} className="compact-review--cover-image--container">
                <img
                  className="compact-review--cover-image"
                  src={this.props.coverImages[this.props.review.pid]}/>
              </a>
            </td>
            <td className="compact-review--review-content">
              <Icon glyph={materialSvgs[review.worktype]}
                    width={25} height={25}
                    className="icon compact-review-worktype-icon"/>
              <a href={workUrl}>
                {this.getTextContent(review.html)}
              </a>
              <Rating rating={review.rating} starsOnly={false} pid={review.pid} />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderVideoReview (review, ownerProfileUrl, workUrl) {
    const resolution = review.video.resolutions.slice(-1)[0];
    const pureFileName = resolution.video.name.substring(0, resolution.video.name.lastIndexOf('.'));
    const videoImageSrc = `https://s3-eu-west-1.amazonaws.com/uxdev-biblo-video-thumbnails/${pureFileName}_thumb_00001.png`;

    return (
      <div className="compact-review--container">
        <p>Anmeldelse af: <a href={ownerProfileUrl}>{review.owner.displayName}</a></p>
        <div className="compact-video-review--artwork-container">
          <a href={ownerProfileUrl} className="compact-review--owner-image--container">
            <img src={review.owner.image}/>
          </a>
          <a href={workUrl} className="compact-review--video--container">
            <img src={videoImageSrc} />
            <span className="after" />
          </a>
        </div>
        <div className="compact-review--container--video-review--rating--container">
          <Icon glyph={materialSvgs[review.worktype]}
                width={25} height={25}
                className="icon compact-review-worktype-icon"/>
          <Rating rating={review.rating} starsOnly={false} pid={review.pid} />
        </div>
      </div>
    );
  }

  render() {
    const review = this.props.review;
    const ownerProfileUrl = `/profil/${review.owner.id}`;
    const workUrl = `/materiale/${encodeURIComponent(review.pid)}`;
    let reviewContent;

    if (review.video) {
      reviewContent = this.renderVideoReview(review, ownerProfileUrl, workUrl);
    }
    else {
      reviewContent = this.renderTextReview(review, ownerProfileUrl, workUrl);
    }

    return (
      <div className="compact-review--container--container">
        {reviewContent}
      </div>
    );
  }
}

CompactReviewElement.displayName = 'CompactReviewElement';
CompactReviewElement.propTypes = {
  review: PropTypes.object.isRequired,
  coverImages: PropTypes.object.isRequired,
  getCoverImageAction: PropTypes.func.isRequired
};
