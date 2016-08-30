import React from 'react';
import * as hyperlinks from '../../Constants/hyperlinks.constants';
import './_footer.scss';

import NavbarLink from '../Navbar/NavbarLink.component';
import Icon from '../General/Icon/Icon.component';
import bibloSvg from './../Navbar/svg/biblo_negative.svg';


export default class FooterContainer extends React.Component {
  render() {
    const menus = {};

    if (this.props.globalState.menu) {
      menus.main = this.props.globalState.menu.main.map(item => <li key={item.id}><NavbarLink value={item.title} url={item.url} /></li>);
      menus.footer = this.props.globalState.menu.footer.map(item => <li key={item.id}><NavbarLink value={item.title} url={item.url} /></li>);
    }

    return (
      <div className="footer--container">
        <div className="footer--coloumns-container">
          <div className="footer--left-coloumn">
            <ul className="footer--main-menu">
              <li>
                <a className='bibloLogo' href={hyperlinks.DET_SKER_PAGE}>
                  <Icon icon="profile" width={100} height={30} glyph={bibloSvg}/>
                </a>
              </li>
              {menus.main}
            </ul>
          </div>

          <div className="footer--right-coloumn">
            <ul className="footer--sub-menu">
              {menus.footer}
            </ul>
          </div>
        </div>

        <div className="footer--copyright-container">
          <p className="footer--copyright-text">Copyright 2016 &copy; De danske folkebiblioteker</p>
        </div>

        <div className="footer--bottom">
          <img className="footer--bottom-image" src="/footer_layer_258.png"/>
        </div>
      </div>
    );
  }
}

FooterContainer.propTypes = {
  globalState: React.PropTypes.object.isRequired
};

FooterContainer.defaultProps = {
  globalState: {}
};

FooterContainer.displayName = 'FooterContainer';
