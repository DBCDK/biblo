import React from 'react';

import './WorkDetail.component.scss';

import {TagList} from '../TagList/TagList.component.js';
import MaterialButton from '../../General/MaterialButton/MaterialButton.component.js';
import ReviewButton from '../../Review/ReviewButton.js';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component.js';
import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat small/book.svg';
import pencilSvg from '../../General/Icon/svg/functions/pencil.svg';
import plusSvg from '../../General/Icon/svg/functions/plus.svg';

import reviewButton from '../../Review/ReviewButton.js';

export class WorkDetail extends React.Component {

  render() {
    const imageUrl = 'http://ecx.images-amazon.com/images/I/31Bnsm4xG4L._SX300_BO1,204,203,200_.jpg';
    const title = 'Satans Bibel';
    const creator = 'Anton Szandor LaVey';
    const year = 2004;
    const workType = 'book'; // eslint-disable-line no-unused-vars
    const materialTypes = ['ebook', 'audiobook', 'book'];

    const materialTypeElements = materialTypes.map((materialType) => (<li><MaterialButton materialType={materialType} active={true} /></li>));

    const description = 'Om satanismens filosofi med beskrivelse af ritualer og ceremonier.' +
      ' Satans Bibel er den danske oversættelse af "The Satanic Bible" (Anton LaVey, 1969), ' +
      'der blev udgivet kort efter oprettelsen af Church of Satan. Bogen skulle fungere som ' +
      'filosofisk manifest og håndbog i den nye kirkes filosofi. Anton LaVey forklarede senere, ' +
      'at bogen skulle hurtigt på markedet, og derfor blev den sammensat i hast. Dette skete ' +
      'blandt andet ved at genbruge meget materiale fra andre forfattere.';

    const tags = ['Satans Kirke', 'satanisme'];

    return (
      <div className='work-detail'>
        <div className='work-detail--main'>
          <Icon glyph={bookSvg} className='work-detail--worktype-icon' width={36} height={36}/>
          <h2>{title}</h2>
          <span className='work-detail--subheader'>{creator}, {year}</span>
          <div className='work-detail--description'>
            {description}
          </div>

          <TagList tags={tags}/>

          <a className='work-detail--show-more-button'><Icon glyph={plusSvg} />Vis mere</a>

          <div className='work-detail--action-buttons'>
            <ReviewButton clickFunction={this.props.toggleReview.bind(this)} />
          </div>
        </div>

        <div className='work-detail--secondary'>
          <div className='work-detail--large-cover'>
            <img src={imageUrl}/>
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
  toggleReview: React.PropTypes.func.isRequired
};
