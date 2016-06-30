import React, {PropTypes} from 'react';
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
  image: React.PropTypes.object,
  onClick: React.PropTypes.func
};

NavBarProfileImage.defaultProps = {
  notifications: 0
};
