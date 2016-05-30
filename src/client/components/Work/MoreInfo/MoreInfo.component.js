import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat small/book_no_border.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat small/film_no_border.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat small/game_no_border.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat small/music_no_border.svg';
import otherSvg from '../../General/Icon/svg/Materialikon-kvadrat small/animalpaw.svg';

import './MoreInfo.component.scss';

function type2iconType(type, workType) {

  let iconType = otherSvg;

  if (workType === 'audiobook') {
    iconType = audiobookSvg;
  }
  else if (workType === 'book') {
    iconType = bookSvg;
  }
  else if (workType === 'game') {
    iconType = gameSvg;
  }
  else if (workType === 'movie') {
    iconType = movieSvg;
  }
  else if (workType === 'music') {
    iconType = musicSvg;
  }
  return iconType;
}

export class MoreInfo extends React.Component {

  render() {

    const workType = this.props.workType;

    const seriesRow = (this.props.series) ? (<tr><td>Serie</td><td>{this.props.series}</td></tr>) : null;

    const yearRow = (this.props.year) ? (<tr><td>Udgivet i</td><td>{this.props.year}</td></tr>) : null;

    const tagElements = (this.props.tags) ? this.props.tags.map((tag) => (<div><a href={'/find?emneord=' + tag}>{tag}</a></div>)) : null;
    const tagsRow = (this.props.tags.length > 0) ? (<tr><td>Emne</td><td>{tagElements}</td></tr>) : null;

    const dk5Row = (this.props.dk5) ? (<tr><td>DK5</td><td>{this.props.dk5}</td></tr>) : null;

    const dk5TextRow = (this.props.dk5Text) ? (<tr><td>Opstilling</td><td>{this.props.dk5Text}</td></tr>) : null;

    const languages = this.props.languages || [];
    const languageElements = languages.map((language) => (<div>{language}</div>));
    const languagesRow = (languages.length > 0) ? (<tr><td>Sprog</td><td>{languageElements}</td></tr>) : null;

    const agesRecommended = this.props.ageRecommended || [];
    const agesRecommendedElements = agesRecommended.map((age) => (<span>{age}</span>));
    const agesRecommendedRow = (agesRecommended.length > 0) ? (<tr><td>Alder</td><td>{agesRecommendedElements}</td></tr>) : null;

    const ageAllowedRow = (this.props.ageAllowed) ? (<tr><td>Tilladt for</td><td>{this.props.ageAllowed}</td></tr>) : null;

    const lixRow = (this.props.lix) ? (<tr><td>Lix</td><td>{this.props.lix}</td></tr>) : null;

    const publisherRow = (this.props.publisher && workType === 'game') ? (<tr><td>Udgiver</td><td>{this.props.publisher}</td></tr>) : null;

    const directorRow = (this.props.director) ? (<tr><td>Instruktør</td><td>{this.props.director}</td></tr>) : null;

    const actors = this.props.actors || [];
    const actorsElements = actors.map((actor) => (<div>{actor}</div>));
    const actorsRow = (actors.length > 0) ? (<tr><td>Medvirkende</td><td>{actorsElements}</td></tr>) : null;

    const extentRow = (this.props.extent && workType !== 'music') ? (<tr><td>Omfang</td><td>{this.props.extent}</td></tr>) : null;


    let uniqueMaterialTypes = {};
    if (this.props.materials) {
      this.props.materials.forEach((material) => {
        uniqueMaterialTypes[material.type] = {
          type: material.type,
          workType: material.workType
        };
      });
    }

    const materialTypeElements = Object.keys(uniqueMaterialTypes).map((key) => (
        <li className={'more-info--material-type'}>
          <Icon
            width={36}
            height={36}
            glyph={type2iconType(uniqueMaterialTypes[key].type[0], uniqueMaterialTypes[key].workType[0])}/>
          <span>{uniqueMaterialTypes[key].type[0]}</span>
        </li>
      )
    );

    return (
      <div className='more-info'>
        <h2>Mere info</h2>
        <table className='more-info--table'>
          <tbody>
            {publisherRow}
            {directorRow}
            {actorsRow}
            {seriesRow}
            {tagsRow}
            {yearRow}
            {dk5Row}
            {dk5TextRow}
            {languagesRow}
            {ageAllowedRow}
            {agesRecommendedRow}
            {lixRow}
            {extentRow}
          </tbody>
        </table>
        <ul className='more-info--material-types'>
          {materialTypeElements}
        </ul>
      </div>
    );
  }
}

MoreInfo.displayName = 'MoreInfo';
MoreInfo.propTypes = {
  workType: React.PropTypes.string.isRequired,
  tags: React.PropTypes.array,
  series: React.PropTypes.string,
  year: React.PropTypes.string,
  dk5: React.PropTypes.string,
  dk5Text: React.PropTypes.string,
  languages: React.PropTypes.array,
  ageRecommended: React.PropTypes.array,
  ageAllowed: React.PropTypes.string,
  publisher: React.PropTypes.string,
  director: React.PropTypes.string,
  actors: React.PropTypes.array,
  lix: React.PropTypes.number,
  extent: React.PropTypes.string,
  materials: React.PropTypes.array.isRequired
};

