import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/book_no_border.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/film_no_border.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/game_no_border.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/music_no_border.svg';
import otherSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/other_no_border.svg';

import './MoreInfo.component.scss';

const MORE_INFO_TYPES = {
  publisher: 'Udgiver',
  director: 'Instruktør',
  actors: 'Medvirkende',
  series: 'Serie',
  tags: 'Emne',
  year: 'Udgivet i',
  dk5: 'DK5',
  dk5Text: 'Opstilling',
  languages: 'Sprog',
  ageAllowed: 'Tilladt for',
  ageRecommended: 'Alder',
  lix: 'Lix',
  extent: 'Omfang'
};

export class MoreInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Returns svg based on given workType
   *
   * @param {string} workType
   * @returns {string} iconType
   */
  type2iconType(workType) {

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

  /**
   * Returns rendered block
   *
   * @param {string} type
   * @param {XML} content
   * @param {string} key
   * @returns {XML|null}
   */
  getMoreInfoRow(type, content, key) {
    if (!content) {
      return null;
    }

    return (
      <div className="more-info--row" key={key}>
        <span className="more-info--type" >{type}</span>
        <span className="more-info--content" >{content}</span>
      </div>
    );
  }

  getSubjects() {
    const tags = Array.isArray(this.props.tags) && this.props.tags.length ? this.props.tags : null;
    if (!tags) {
      return null;
    }

    return tags.map((tag, key) => (<a key={key} href={'/find?emneord=' + tag} >{tag} </a>));
  }

  getGenericList(key) {
    const list = this.props[key];
    if (!list) {
      return null;
    }
    return list.map((item, index) => (<span key={index} >{item}<br /></span>));
  }

  getMoreInfoElements() {
    const workType = this.props.workType;
    const keys = Object.keys(MORE_INFO_TYPES);
    const elements = [];

    keys.forEach((key) => {
      const type = MORE_INFO_TYPES[key];
      let content;

      switch (key) {
        case 'tags': {
          content = this.getSubjects();
          break;
        }
        case 'languages':
        case 'ageRecommended':
        case 'year':
        case 'actors': {
          content = this.getGenericList(key);
          break;
        }
        case 'publisher': {
          content = workType === 'game' ? this.props[key] : null;
          break;
        }
        case 'extent': {
          content = workType !== 'music' ? this.props[key] : null;
          break;
        }
        default: {
          content = this.props[key] || null;
          break;
        }
      }

      elements.push(this.getMoreInfoRow(type, content, key));
    });

    return elements;
  }

  getMaterials() {
    const uniqueMaterialTypes = {};
    if (this.props.materials) {
      this.props.materials.forEach((material) => {
        uniqueMaterialTypes[material.type] = {
          type: material.type,
          workType: material.workType
        };
      });
    }

    return Object.keys(uniqueMaterialTypes).map((key) => (
        <li className={'more-info--material-type'} key={key} >
          <Icon
            width={36}
            height={36}
            glyph={this.type2iconType(uniqueMaterialTypes[key].workType[0])} />
          <span>{uniqueMaterialTypes[key].type[0]}</span>
        </li>
      )
    );
  }

  render() {
    const moreInfoElements = this.getMoreInfoElements();
    const materialTypeElements = this.getMaterials();

    return (
      <div className='more-info' >
        <div className="more-info--header" >Mere info</div>
        {moreInfoElements}
        <ul className='more-info--material-types' >
          {materialTypeElements}
        </ul>
      </div>
    );
  }
}

MoreInfo.displayName = 'MoreInfo';
MoreInfo.propTypes = {
  workType: React.PropTypes.string,
  tags: React.PropTypes.array,
  series: React.PropTypes.string,
  year: React.PropTypes.array,
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
  materials: React.PropTypes.array
};

