import React from 'react';

import './WorkDetail.component.scss';

import {TagList} from '../TagList/TagList.component.js';
import MaterialButton from '../../General/MaterialButton/MaterialButton.component.js';
import ReviewButton from '../../Review/ReviewButton.js';
import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat small/book.svg';
import plusSvg from '../../General/Icon/svg/functions/plus.svg';

export class WorkDetail extends React.Component {

  render() {
    const coverUrl = this.props.coverUrl;
    const title = this.props.title;
    const creator = this.props.creator;
    const year = this.props.year;
    const displayType = this.props.displayType; // eslint-disable-line no-unused-vars
    const materialTypes = ['ebook', 'audiobook', 'book'];

    const materialTypeElements = materialTypes.map((materialType) => (<li><MaterialButton materialType={materialType} active={true} /></li>));

    const abstract = this.props.abstract;

    const tags = this.props.tags;

    return (
      <div className='work-detail'>
        <div className='work-detail--main'>
          <Icon glyph={bookSvg} className='work-detail--worktype-icon' width={36} height={36}/>
          <h2>{title}</h2>
          <span className='work-detail--subheader'>{creator}, {year}</span>
          <div className='work-detail--description'>
            {abstract}
          </div>

          <TagList tags={tags}/>

          <a className='work-detail--show-more-button'><Icon glyph={plusSvg} />Vis mere</a>

          <div className='work-detail--action-buttons'>
            <ReviewButton clickFunction={this.props.toggleReview.bind(this)} />
          </div>
        </div>

        <div className='work-detail--secondary'>
          <div className='work-detail--large-cover'>
            <img src={coverUrl}/>
          </div>

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
  toggleReview: React.PropTypes.func.isRequired,
  abstract: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  creator: React.PropTypes.string.isRequired,
  tags: React.PropTypes.array.isRequired,
  year: React.PropTypes.string.isRequired,
  displayType: React.PropTypes.string.isRequired,
  coverUrl: React.PropTypes.string.isRequired
};
