// Libs
import React from 'react';

// Components
import SearchContainer from '../SearchBox/SearchContainer.component.js';
import ClickOverlay from '../General/ClickOverlay/ClickOverlay.Component.js';
import NavbarLink from './NavbarLink.component.js';
import NavbarIconLink from './NavbarIconLink.component.js';
import NavbarToggle from './NavbarToggle.component.js';
import NavbarMobileMenu from './NavbarMobileMenu.component.js';
import NavBarProfileImage from './NavBarProfileImage.component';
import Icon from '../General/Icon/Icon.component';

// Constants
import {DET_SKER_PAGE, GROUP_OVERVIEW, PUBLIC_PROFILE} from '../../Constants/hyperlinks.constants';

// SVG's
import bibloSvg from './svg/biblo_negative.svg';
import profileSvg from '../General/Icon/svg/knap-ikoner-small/profile.svg';
import searchSvg from '../General/Icon/svg/knap-ikoner-small/search.svg';

// Styles
import './styling/navbar.scss';

let image = {
  shouldDisplay: false
};

let data = document.getElementById('JSONDATA_USER_PROFILE_IMAGE');
if (data && data.innerHTML && data.innerHTML.length > 0) {
  image = JSON.parse(data.innerHTML);
}

export default class NavbarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {
        profile: false,
        menu: false,
        button: false
      }
    };
  }

  onToggle(type) {
    const active = {
      button: false,
      menu: false,
      profile: false
    };

    if (type === 'profile' && active.profile) {
      active.profile = false;
    }
    else if (!this.state.active.button) {
      active[type] = true;
      active.button = true;
    }
    this.setState({active});
  }

  toggleSearchBox() {
    this.props.searchActions.toggleSearchBox();
  }

  renderProfile() {
    if (image.shouldDisplay) {
      return (<NavBarProfileImage image={image} url={PUBLIC_PROFILE} onClick={() => this.onToggle('profile')} notifications={image.unreadMessages} />);
    }
    return (<NavbarIconLink width={35} height={35} className="navbar--profile" url="#" glyph={profileSvg}
                             onClick={() => this.onToggle('profile')}/>);
  }

  renderSearch() {
    return (
      <NavbarIconLink width={35} height={35} className="navbar--search" url="#" glyph={searchSvg}
                      onClick={() => this.toggleSearchBox()}/>
    );
  }

  renderProfileLinks() {
    if (!image.shouldDisplay) {
      return (
        <ul className="">
          <li><NavbarLink value='Log ind' url='/login'/></li>
        </ul>
      );
    }

    return (
      <ul className="">
        <li><NavbarLink value='Profil' url='/profil'/></li>
        <li><NavbarLink value='Log ud' url='/logout'/></li>
      </ul>
    );
  }

  render() {
    return (
      <div className="navbar">
        <div className="navbar--container">
          <div className="navbar--menu">
            <ul className="inline-list">
              <li>
                <a className='bibloLogo' href={DET_SKER_PAGE}>
                  <Icon icon="profile" width={100} height={30} glyph={bibloSvg}/>
              </a></li>
              <li><NavbarLink value='Grupper' url={GROUP_OVERVIEW}/></li>
            </ul>
          </div>

          <div className="navbar--icons">
            {this.renderSearch()}
            {this.renderProfile()}
            <NavbarToggle active={this.state.active.button} onToggle={() => this.onToggle('menu')}/>
          </div>
        </div>
        <NavbarMobileMenu active={this.state.active.menu} type='menu'>
          <div className="">
            <ul className="">
              <li><NavbarLink value='Det Sker' url={DET_SKER_PAGE}/></li>
              <li><NavbarLink value='Grupper' url={GROUP_OVERVIEW}/></li>
            </ul>
          </div>
        </NavbarMobileMenu>
        <NavbarMobileMenu active={this.state.active.profile} type='profile'>
          <div className="">
            {this.renderProfileLinks()}
          </div>
        </NavbarMobileMenu>
        <ClickOverlay active={this.state.active.button} onClick={() => this.onToggle('menu')}/>
        <SearchContainer search={this.props.searchState} searchActions={this.props.searchActions} />
      </div>
    );
  }
}

NavbarContainer.displayName = 'NavbarContainer';

NavbarContainer.propTypes = {
  searchState: React.PropTypes.object.isRequired,
  searchActions: React.PropTypes.object.isRequired
};
