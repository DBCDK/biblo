/**
 * @file: Full width banner, developed for, and tested on, the front page of biblo.
 */

import React, {Component, PropTypes} from 'react';
import {debounce, isEqual} from 'lodash';
import './scss/FullWidthBannerWidget.component.scss';

const defaultConfig = {
  title: '',
  description: '',
  desktopImageUrl: '',
  tabletImageUrl: '',
  mobileImageUrl: '',
  linkUrl: ''
};

export class FullWidthBannerWidget extends Component {
  constructor() {
    super();

    // We wait with setting the correct size until we've gotten the SSR benefits.
    let windowWidth = 700;
    let windowHeight = 700;

    this.state = {
      width: windowWidth,
      height: windowHeight
    };
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', debounce(this.windowDidResize.bind(this), 50));
      this.windowDidResize();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If the state updates, the component should update
    // If the props update, we don't care unless it's the widgetConfig.
    return !isEqual(nextState, this.state) || !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  windowDidResize() {
    this.setState({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  }

  render() {
    let {title, description, desktopImageUrl, tabletImageUrl, mobileImageUrl, linkUrl} = Object.assign(defaultConfig, this.props.widgetConfig);
    let imageUrl = desktopImageUrl;

    if (this.state.width <= 600) {
      imageUrl = mobileImageUrl;
    }
    else if (this.state.width <= 800) {
      imageUrl = tabletImageUrl;
    }

    const styleObj = {
      backgroundImage: `url(${imageUrl})`
    };

    return (
      <a href={linkUrl} className="full-width-banner--href">
        <div className="full-width-banner--image" style={styleObj}>
          <div className="full-width-banner--image--text--container">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
      </a>
    );
  }
}

FullWidthBannerWidget.displayName = 'FullWidthBannerWidget';
FullWidthBannerWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};
