import React from 'react';

import './GroupSearchResultList.scss';

import Icon from '../../General/Icon/Icon.component.js';
import groupSvg from '../../General/Icon/svg/functions/group.svg';


export default class GroupSearchResultList extends React.Component {
  getCoverImageUrl(group) {
    let url;
    if (group.coverImage) {
      url = '/billede/' + group.coverImage.id + '/small-square';
    }
    else {
      url = '/no_group_image.png';
    }
    return url;
  }

  render() {
    const listElements = this.props.results.map((result, i) => {
      let groupUrl = '/grupper/' + result.id;
      return (
        <li key={i}>
          <a href={groupUrl}>
            <div className='cover-image'>
              <img src={this.getCoverImageUrl(result)}/>
            </div>
            <div className='description'>
              <div className='title'>
                <Icon className="icon" glyph={groupSvg}/>
                {result.name}
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
        <div className='empty-result'>
          Vi kunne ikke finde noget der passer med din søgning. Prøv at skrive din søgning på en anden måde.
        </div>
      );
    }

    return (
      <div className='group-result-list'>
        <h2>I grupperne:</h2>
        <hr/>
        {result}
      </div>
    );
  }
}

GroupSearchResultList.displayName = 'GroupSearchResultList';

GroupSearchResultList.propTypes = {
  results: React.PropTypes.array.isRequired
};
