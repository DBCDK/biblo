import React from 'react';
import PropTypes from 'prop-types';
import './scss/navbar-profile-image.scss';

export default function NavBarProfileImage({image, onClick, notifications}) {
  return (
      <a className={'profile-image--icon'} onClick={(event) => onClick && onClick(event)}>
        <div>
          {notifications > 0 ? <span className="profile-image--notification-count">{notifications}</span> : <span />}
          <img src={image.url} />
        </div>
      </a>
  );
}

NavBarProfileImage.propTypes = {
  notifications: PropTypes.number,
  image: PropTypes.object,
  onClick: PropTypes.func
};

NavBarProfileImage.defaultProps = {
  notifications: 0
};
