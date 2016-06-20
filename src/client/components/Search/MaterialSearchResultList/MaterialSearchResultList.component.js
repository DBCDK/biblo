import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import bookSvg from '../../General/Icon/svg/Materialikon-kvadrat small/book.svg';
import audiobookSvg from '../../General/Icon/svg/materialikon-uden-kvadrat/materialikon-uden-kvadrat-lydbog.svg';
import gameSvg from '../../General/Icon/svg/Materialikon-kvadrat small/game.svg';
import musicSvg from '../../General/Icon/svg/Materialikon-kvadrat small/music.svg';
import movieSvg from '../../General/Icon/svg/Materialikon-kvadrat small/film.svg';
import otherSvg from '../../General/Icon/svg/Materialikon-kvadrat small/group.svg';

import './MaterialSearchResultList.scss';

const displayTypeSvgs = {
  book: bookSvg,
  audiobook: audiobookSvg,
  game: gameSvg,
  music: musicSvg,
  movie: movieSvg,
  other: otherSvg
};

function displayWorkTypeCover(type) {
  const basePath = '/images/covers/';
  const types = ['book', 'game', 'music', 'movie', 'audiobook'];
  let fileName = 'other.png';
  if (types.indexOf(type) !== -1) {
    fileName = type + '.png';
  }
  return basePath + fileName;
}

export default class MaterialSearchResultList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const listElements = this.props.results.map((result, i) => {

      const pid = result.pid[0];
      const displayType = result.workType[0];
      const displayWorkType = (result.workType) ? result.workType[0] : 'other';
      const coverUrl = (result.coverUrlFull) ? 'http:' + result.coverUrlFull[0] : displayWorkTypeCover(displayWorkType);
      const workUrl = '/materiale/' + pid;

      return (
        <li key={i}>
          <a href={workUrl}>
            <div className='material-result-list--cover-image'>
              <img src={coverUrl} />
            </div>
            <div className='material-result-list--description'>
              <Icon glyph={displayTypeSvgs[displayType]} />
              <div className='material-result-list--title'>
                {result.dcTitle}
              </div>
            </div>
          </a>
        </li>
      );
    });

    let result = (
      <ul className>
        {listElements}
      </ul>
    );
    if (listElements.length === 0) {
      result = (
        <div className='material-result-list--empty-result'>
          Vi kunne ikke finde noget der passer med din søgning. Prøv at skrive din søgning på en anden måde.
        </div>
      );
    }

    return (
      <div className='material-result-list'>
        <h2>På biblioteket:</h2>
        <hr/>
        {result}
      </div>
    );
  }
}

MaterialSearchResultList.displayName = 'MaterialSearchResultList';

MaterialSearchResultList.propTypes = {
  results: React.PropTypes.array.isRequired
};
