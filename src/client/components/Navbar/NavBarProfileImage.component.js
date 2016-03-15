'use strict';

import React, {PropTypes} from 'react';
import './styling/navbar-profile-image.scss';

export default function NavBarProfileImage({image, url, onClick, notifications}) {
  let html = <span />;

  if (image.shouldDisplay) {
    html = (
      <a className={'profile-image--icon'} onClick={(event) => onClick && onClick(event)}>
        <div>
          {notifications > 0 ? <span className="profile-image--notification-count">{notifications}</span> : <span />}
          <img src={image.url} />
        </div>
      </a>
    );
  }

  return html;
}

NavBarProfileImage.propTypes = {
  url: PropTypes.string.isRequired,
  notifications: PropTypes.number
};

NavBarProfileImage.defaultProps = {
  notifications: 0
};
