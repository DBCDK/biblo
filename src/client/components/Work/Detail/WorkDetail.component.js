import React from 'react';

import './WorkDetail.component.scss';

import {TagList} from '../TagList/TagList.component.js';

export class WorkDetail extends React.Component {
  render() {

    const imageUrl = 'https://moreinfo.addi.dk/2.1/more_info_get.php?id=34941100&type=forside_500&key=ff65faa369343c15ac8d';
    const title = 'Satans Bibel';
    const creator = 'Anton Szandor LaVey';
    const year = 2004;
    const workType = 'book';
    const materialTypes = ['e-bog', 'lydbog', 'bog'];
    const materialTypeElements = materialTypes.map((materialType) => (<li>{materialType}</li>));

    const description = 'Om satanismens filosofi med beskrivelse af ritualer og ceremonier';
    const tags = ['Satans Kirke', 'satanisme'];

    return (
      <div className='work-detail'>
        <div className='work-detail--main'>
          <h2>{title}</h2>
          <span className='work-detail--subheader'>{creator}, {year}</span>
          <div className='work-detail--description'>
            {description}
          </div>

          <TagList tags={tags}/>

          <div className='work-detail--action-buttons'></div>
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

};
