import React from 'react';
import PropTypes from 'prop-types';

import './WorkHeader.component.scss';

export class WorkHeader extends React.Component {
  render() {

    const coverUrl = this.props.coverUrl;

    return (
      <div className='work-header'>
        <div className='work-header--background-image' style={{backgroundImage: `url("${coverUrl}")`}}></div>
        <div className="work-header--foreground-image--wrapper">
          <div className='work-header--foreground-image'><img src={coverUrl} /></div>
        </div>
      </div>
    );
  }
}

WorkHeader.displayName = 'WorkHeader';
WorkHeader.propTypes = {
  coverUrl: PropTypes.string.isRequired
};
