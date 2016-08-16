import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/book_no_border.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/game_no_border.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/music_no_border.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/film_no_border.svg';
import otherSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/other_no_border.svg';

import './MaterialSearchResultList.scss';

const displayTypeSvgs = {
  book: bookSvg,
  audiobook: audiobookSvg,
  game: gameSvg,
  music: musicSvg,
  movie: movieSvg,
  other: otherSvg
};

export default class MaterialSearchResultList extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Returns string pointing to appropriate coverimage depending on material type.
   *
   * @param {string} type
   * @return {string}
   */
  displayWorkTypeCover(type) {
    const basePath = '/images/covers/';
    const types = ['book', 'game', 'music', 'movie', 'audiobook'];
    let fileName = 'other.png';
    if (types.indexOf(type) !== -1) {
      fileName = type + '.png';
    }
    return basePath + fileName;
  }

  getListElements() {
    return this.props.results.map((result, i) => {

      const pid = result.pid[0];
      const displayType = result.workType[0];
      const displayWorkType = (result.workType) ? result.workType[0] : 'other';
      const coverUrl = (result.coverUrlFull) ? 'http:' + result.coverUrlFull[0] : this.displayWorkTypeCover(displayWorkType);
      const workUrl = '/materiale/' + pid;

      return (
        <div className="result-item" key={i} >
          <a href={workUrl} >
            <div className='cover-image' >
              <img src={coverUrl} />
            </div>
            <div className='description' >
              <div className='title' >
                <Icon glyph={displayTypeSvgs[displayType]} />
                {result.dcTitle}
              </div>
            </div>
          </a>
        </div>
      );
    });
  }

  render() {
    const listElements = this.getListElements();
    const result = listElements.length ? listElements : 'Vi kunne ikke finde noget der passer med din søgning. Prøv at skrive din søgning på en anden måde.';

    return (
      <div className='material-search--result-container' >
        <h2>På biblioteket:</h2>
        <hr/>
        <div className="material-search--results" >
          {result}
        </div>
      </div>
    );
  }
}

MaterialSearchResultList.displayName = 'MaterialSearchResultList';
MaterialSearchResultList.propTypes = {
  results: React.PropTypes.array.isRequired
};
