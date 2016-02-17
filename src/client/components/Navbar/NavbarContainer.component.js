'use strict';

import React from 'react';
import ClickOverlay from 'General/ClickOverlay/ClickOverlay.Component.js';
import NavbarLink from './NavbarLink.component.js';
import NavbarIconLink from './NavbarIconLink.component.js';
import NavbarToggle from './NavbarToggle.component.js';
import NavbarMobileMenu from './NavbarMobileMenu.component.js';

import './styling/navbar.scss';

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

  render() {
    return (
      <div className="navbar">
        <div className="navbar--container">
          <div className="navbar--menu">
            <ul className="inline-list">
              <li><NavbarLink value='Det Sker' url='#det-sker-dummy'/></li>
              <li><NavbarLink value='Grupper' url='/grupper'/></li>
            </ul>
          </div>
          <div className="navbar--icons">
            <NavbarIconLink icon='search' url="#search"/>
            <NavbarIconLink icon='profile' url="#profile" onClick={() => this.onToggle('profile')}/>
            <NavbarToggle active={this.state.active.button} onToggle={() => this.onToggle('menu')}/>
          </div>
        </div>
        <NavbarMobileMenu active={this.state.active.menu} type='menu'>
          <div className="">
            <ul className="">
              <li><NavbarLink value='Det Sker' url='#det-sker-dummy'/></li>
              <li><NavbarLink value='Grupper' url='#det-sker-dummy'/></li>
            </ul>
          </div>
        </NavbarMobileMenu>
        <NavbarMobileMenu active={this.state.active.profile} type='profile'>
          <div className="">
            <ul className="">
              <li><NavbarLink value='Lånerstatus' url='#lånerstatus'/></li>
              <li><NavbarLink value='Log ud' url='#log ud'/></li>
            </ul>
          </div>
        </NavbarMobileMenu>
        <ClickOverlay active={this.state.active.button} onClick={() => this.onToggle('menu')} />
      </div>
    );
  }
}

NavbarContainer.displayName = 'NavbarContainer';
