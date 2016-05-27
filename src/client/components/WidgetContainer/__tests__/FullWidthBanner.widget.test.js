/**
 * @file: This file contains tests for the Full Width Banner widget.
 **/

// import libs
import React from 'react';
import expect from 'expect';
import $ from 'teaspoon';

// import components
import WidgetContainer from '../WidgetContainer.component';

describe('Test FullWidthBanner Widget', () => {
  it('Test FullWidthBanner widget can render inside a WidgetContainer', () => {
    const widgetLocationName = 'test-latest-review-widget-location';
    let widgetState = {
      widgetLocations: {}
    };
    const widgetActions = {};

    widgetState.widgetLocations[widgetLocationName] = {
      widgetName: 'FullWidthBannerWidget',
      widgetConfig: {
        title: 'And yet another dummy title',
        description: 'This is a dummy banner description!',
        desktopImageUrl: 'https://this.is.a.dumme.link/dummy.desktop.png',
        tabletImageUrl: 'https://this.is.a.dumme.link/dummy.tablet.png',
        mobileImageUrl: 'https://this.is.a.dumme.link/dummy.mobile.png',
        linkUrl: 'https://this.is.a.dummy.link'
      }
    };

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    let $root = $(component).render();

    const FullWidthBannerWidgetTitle = $root.find('.full-width-banner--image--text--container > h2').text();
    expect(FullWidthBannerWidgetTitle).toEqual('And yet another dummy title');

    const FullWidthBannerWidgetDescription = $root.find('.full-width-banner--image--text--container > p').text();
    expect(FullWidthBannerWidgetDescription).toEqual('This is a dummy banner description!');

    const FullWidthBannerWidgetHref = $root.find('.full-width-banner--href').props().href;
    expect(FullWidthBannerWidgetHref).toEqual('https://this.is.a.dummy.link');

    const FullWidthBannerWidgetBackgroundImage = $root.find('.full-width-banner--image').props().style.backgroundImage;
    expect(FullWidthBannerWidgetBackgroundImage).toEqual('url(https://this.is.a.dumme.link/dummy.desktop.png)');
  });
});
