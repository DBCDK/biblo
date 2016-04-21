import React from 'react';

import './MaterialSearchResultList.scss';


export default class MaterialSearchResultList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const listElements = this.props.results.map((result, i) => {

      const pid = result.pid[0];

      const workUrl = '/vaerk/' + pid;

      return (
        <li key={i}>
          <a href={workUrl}>
            <div className='material-result-list--cover-image'>
              <img width='160' height='220' />
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
