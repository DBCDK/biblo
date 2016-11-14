/**
 * @file: Full width banner slider, shows a bunch of images with some text and a link.
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';
import {FullWidthBannerWidget} from '../FullWidthBannerWidget/FullWidthBanner.widget.component';

import './scss/FullWidthBannerSliderWidget.Component.scss';

const defaultTTN = 5000;

export class FullWidthBannerSliderWidget extends AbstractWidget {
  constructor(props) {
    super(props);
    this.state = {
      image: 0,
      timer: null,
      xDown: null,
      yDown: null
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  componentDidMount() {
    const image = this.props.widgetConfig.images[0];
    if (image && image.TTN) {
      this.setState({
        timer: setTimeout(this.nextSlide, image.TTN || defaultTTN)
      });
    }

    // Preload images to avoid stutter
    this.props.widgetConfig.images.forEach(img => {
      let i = document.createElement('img');
      i.src = img.desktopImageUrl;

      i = document.createElement('img');
      i.src = img.tabletImageUrl;

      i = document.createElement('img');
      i.src = img.mobileImageUrl;
    });
  }

  // touch start handler
  // sets x and y coordinates to state to ease diff creation.
  handleTouchStart(event) {
    this.setState({
      xDown: event.touches[0].clientX,
      yDown: event.touches[0].clientY
    });
  }

  // touch move handler
  // Checks if movement in x is greatest
  // Calls correct handler if it is.
  handleTouchMove(event) {
    if (!this.state.xDown || !this.state.yDown) {
      return null;
    }

    // Calculate movement in a given direction
    const xDiff = this.state.xDown - event.touches[0].clientX;
    const yDiff = this.state.yDown - event.touches[0].clientY;

    if (Math.abs(yDiff) < Math.abs(xDiff)) { // get most significant direction
      if (xDiff > 0) {
        this.nextSlide(false);
      }
      else {
        this.previousSlide(false);
      }
    }

    this.setState({
      xDown: null,
      yDown: null
    });
  }

  nextSlide(timer = true) {
    // figure out index of next image
    const images = this.props.widgetConfig.images;
    let nextImage = this.state.image + 1;
    if (images.length <= nextImage) {
      nextImage = 0;
    }

    clearTimeout(this.state.timer);

    this.setState({
      image: nextImage,
      timer: timer && setTimeout(this.nextSlide, images[nextImage].TTN || defaultTTN)
    });
  }

  previousSlide(timer = true) {
    // figure out index of next image
    const images = this.props.widgetConfig.images;
    let previousImage = this.state.image - 1;
    if (previousImage < 0) {
      previousImage = images.length - 1;
    }

    clearTimeout(this.state.timer);

    this.setState({
      image: previousImage,
      timer: timer && setTimeout(this.nextSlide, images[previousImage].TTN || defaultTTN) // Only set the new timer if it's specified
    });
  }

  render() {
    // Create instances of FullWidthBanner for each image
    const images = this.props.widgetConfig.images.map(image => {
      return <FullWidthBannerWidget widgetConfig={image} />;
    });

    // Create a dot for each image
    const dots = this.props.widgetConfig.images.map((image, idx) => {
      const active = idx === this.state.image ? 'active' : 'inactive';
      return (
        <span className={`fwbs--image-indicator ${active}`} key={`${idx}_${active}`}>
          {idx === this.state.image ? '◉' : '◎'}
        </span>
      );
    });

    return (
      <div className="full-width-banner-slider-widget" onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove}>
        <div className="fwbs--buttons">
          <span className="fwbs--prev" onClick={() => this.previousSlide(false)}>tilbage</span>
          <span className="fwbs--next" onClick={() => this.nextSlide(false)}>næste</span>
        </div>

        <div className="fwbs--image">
          {images[this.state.image]}
        </div>

        <div className="fwbs--dots">
          {dots}
        </div>
      </div>
    );
  }
}

FullWidthBannerSliderWidget.displayName = 'FullWidthBannerSliderWidget';
