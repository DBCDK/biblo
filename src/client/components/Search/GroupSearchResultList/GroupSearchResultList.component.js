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

  getListElements() {
    return this.props.results.map((result, i) => {
      let groupUrl = '/grupper/' + result.id;
      return (
        <div className="result-item " key={i}>
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
        </div>
      );
    });
  }

  render() {
    const listElements = this.getListElements();
    const result = listElements.length ? listElements : 'Vi kunne ikke finde noget der passer med din søgning. Prøv at skrive din søgning på en anden måde.';

    return (
      <div className='group-search--result-container'>
        <h2>I grupperne:</h2>
        <hr/>
        <div className="group-search--results">
          {result}
        </div>
      </div>
    );
  }
}

GroupSearchResultList.displayName = 'GroupSearchResultList';

GroupSearchResultList.propTypes = {
  results: React.PropTypes.array.isRequired
};
