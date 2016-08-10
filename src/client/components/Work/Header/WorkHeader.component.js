import React from 'react';

import './WorkHeader.component.scss';

export class WorkHeader extends React.Component {
  render() {

    const coverUrl = this.props.coverUrl;

    return (
      <div>
        <div className='work-header' >
          <div className='work-header--background-image' style={{backgroundImage: `url("${coverUrl}")`}} ></div>
          <div className="work-header--foreground-image--wrapper">
            <div className='work-header--foreground-image' ><img src={coverUrl} /></div>
          </div>
        </div>
      </div>
    );
  }
}

WorkHeader.displayName = 'WorkHeader';
WorkHeader.propTypes = {
  coverUrl: React.PropTypes.string.isRequired
};
