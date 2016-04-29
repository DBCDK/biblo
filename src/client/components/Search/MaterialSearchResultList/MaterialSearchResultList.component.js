import React from 'react';

import './MaterialSearchResultList.scss';


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
      const displayWorkType = (result.workType) ? result.workType[0] : 'other';
      const coverUrl = (result.coverUrlFull) ? 'http:' + result.coverUrlFull[0] : displayWorkTypeCover(displayWorkType);
      const workUrl = '/vaerk/' + pid;

      return (
        <li key={i}>
          <a href={workUrl}>
            <div className='material-result-list--cover-image'>
              <img width='160' height='220' src={coverUrl} />
            </div>
            <div className='material-result-list--description'>
              {result.dcTitle}
            </div>
          </a>
        </li>
      );
    });

    return (
      <div>
        <ul className='material-result-list'>
          {listElements}
        </ul>
      </div>
    );
  }
}

MaterialSearchResultList.displayName = 'MaterialSearchResultList';

MaterialSearchResultList.propTypes = {
  results: React.PropTypes.array.isRequired
};
