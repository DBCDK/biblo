'use strict';

import React from 'react';
import ClickOverlay from 'General/ClickOverlay/ClickOverlay.Component.js';
import NavbarLink from './NavbarLink.component.js';
import NavbarIconLink from './NavbarIconLink.component.js';
import NavbarToggle from './NavbarToggle.component.js';
import NavbarMobileMenu from './NavbarMobileMenu.component.js';
import NavBarProfileImage from './NavBarProfileImage.component';
import {DET_SKER_PAGE, GROUP_OVERVIEW, PROFILE_EDIT, PUBLIC_PROFILE} from '../../Constants/hyperlinks.constants';

import Icon from '../General/Icon/Icon.component';
import bibloSvg from './svg/biblo_negative.svg';
import profileSvg from '../General/Icon/svg/knap-ikoner-small/profile.svg';

import './styling/navbar.scss';

let image = {
  shouldDisplay: false
};

let data = document.getElementById('JSONDATA_USER_PROFILE_IMAGE');
if (data && data.innerHTML && data.innerHTML.length > 0) {
  image = JSON.parse(data.innerHTML);
}

export default
class NavbarContainer extends React.Component {
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

  renderLoginLink() {
    if (!image.shouldDisplay) {
      return <li><NavbarLink value='Log ind' url='/login'/></li>;
    }
    return <li><NavbarLink value='Log ud' url='/logout'/></li>;
  }

  render() {
    return (
      <div className="navbar">
        <div className="navbar--container">
          <div className="navbar--menu">
            <ul className="inline-list">
              <a className='bibloLogo' href='/'> <Icon icon="profile" width='100' height='30' glyph={bibloSvg} />
              </a>
              <li><NavbarLink value='Grupper' url={GROUP_OVERVIEW}/></li>
            </ul>
          </div>

          <div className="navbar--icons">
            <NavbarIconLink className="navbar--profile" glyph={profileSvg} url="#"
                            onClick={() => this.onToggle('profile')}/>
            <NavBarProfileImage image={image} url={PUBLIC_PROFILE}/>;
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
            <ul className="">
              {this.renderLoginLink()}
            </ul>
          </div>
        </NavbarMobileMenu>
        <ClickOverlay active={this.state.active.button} onClick={() => this.onToggle('menu')}/>
      </div>
    );
  }
}

NavbarContainer.displayName = 'NavbarContainer';
