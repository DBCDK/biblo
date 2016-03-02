'use strict';

import React, {PropTypes} from 'react';
import './styling/navbar-profile-image.scss';

let image = {
  shouldDisplay: false
};

let data = document.getElementById('JSONDATA_USER_PROFILE_IMAGE').innerHTML;

if (data.length > 0) {
  image = JSON.parse(data);
}

export default function NavBarProfileImage({url, notifications}) {
  let html = <span />;

  if (image.shouldDisplay) {
    html = (
      <a className={'profile-image--icon'} href={url}>
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
