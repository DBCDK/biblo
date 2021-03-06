import React from 'react';
import PropTypes from 'prop-types';
import './_footer.scss';

import NavbarLink from '../Navbar/NavbarLink.component';

export default class FooterContainer extends React.Component {
  render() {
    const menus = {};
    const menuState = this.props.globalState.menu;

    if (menuState && Array.isArray(menuState.main) && Array.isArray(menuState.footer)) {
      menus.main = menuState.main.map(item => (
        <li key={item.id}>
          <NavbarLink value={item.title} url={item.url} />
        </li>
      ));
      menus.footer = menuState.footer.map(item => (
        <li key={item.id}>
          <NavbarLink value={item.title} url={item.url} />
        </li>
      ));
    }

    return (
      <div className="footer--container">
        <div className="footer--coloumns-container">
          <div className="footer--left-coloumn">
            <ul className="footer--main-menu">{menus.main}</ul>
          </div>

          <div className="footer--right-coloumn">
            <ul className="footer--sub-menu">{menus.footer}</ul>
          </div>
        </div>

        <div className="footer--copyright-container">
          <p className="footer--copyright-text">Copyright 2016 &copy; De danske folkebiblioteker</p>
        </div>

        <div className="footer--bottom">
          <img className="footer--bottom-image" src="/footer_layer_258.png" />
        </div>
      </div>
    );
  }
}

FooterContainer.propTypes = {
  globalState: PropTypes.object.isRequired
};

FooterContainer.defaultProps = {
  globalState: {}
};

FooterContainer.displayName = 'FooterContainer';
