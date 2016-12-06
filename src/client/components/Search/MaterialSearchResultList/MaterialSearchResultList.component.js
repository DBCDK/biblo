import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/book_no_border.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/game_no_border.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/music_no_border.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/film_no_border.svg';
import otherSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/other_no_border.svg';
import seriesSvg from '../../General/Icon/svg/Materialikon-kvadrat-small/materialeikon-bog-flerbindsværk.svg';

import './MaterialSearchResultList.scss';

const displayTypeSvgs = {
  book: bookSvg,
  audiobook: audiobookSvg,
  game: gameSvg,
  music: musicSvg,
  movie: movieSvg,
  other: otherSvg,
  series: seriesSvg
};

const bindRegex = /bind (\d+)/i;

export default class MaterialSearchResultList extends React.Component {
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
      let displayType = result.workType[0];
      let title = result.dcTitle;
      const displayWorkType = (result.workType) ? result.workType[0] : 'other';
      const coverUrl = (result.coverUrlFull) ? 'http:' + result.coverUrlFull[0] : this.displayWorkTypeCover(displayWorkType);
      const workUrl = '/materiale/' + pid;

      if (result.collectionDetails && result.collectionDetails.length > 1) {
        let bindLow = 0;
        let bindHigh = 0;

        result.collectionDetails.forEach(collectionItem => {
          if (bindRegex.test(collectionItem.type)) {
            const bindNumber = parseInt(bindRegex.exec(collectionItem.type)[1], 10);

            if (!bindLow) {
              bindLow = bindNumber;
            }

            bindHigh = Math.max(bindNumber, bindHigh);
            bindLow = Math.min(bindNumber, bindLow);
          }
        });

        if (bindHigh && bindLow) {
          title = `${result.dcTitle}: Bind ${bindLow}-${bindHigh}`;
          displayType = 'series';
        }
      }

      return (
        <div className="result-item" key={i} >
          <a href={workUrl} >
            <div className='cover-image' >
              <img src={coverUrl} />
            </div>
            <div className='description' >
              <div className='title' >
                <Icon glyph={displayTypeSvgs[displayType]} />
                {title}
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
