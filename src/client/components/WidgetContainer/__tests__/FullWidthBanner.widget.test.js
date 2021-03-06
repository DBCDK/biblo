/**
 * @file: This file contains tests for the Full Width Banner widget.
 **/

// import libs
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

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
        widgetActions={widgetActions}
      />
    );

    const wrapper = mount(component);

    const FullWidthBannerWidgetTitle = wrapper
      .find('.full-width-banner--image--text--container > h2')
      .first()
      .text();
    expect(FullWidthBannerWidgetTitle).to.equal('And yet another dummy title');

    const FullWidthBannerWidgetDescription = wrapper
      .find('.full-width-banner--image--text--container > p')
      .first()
      .text();
    expect(FullWidthBannerWidgetDescription).to.equal('This is a dummy banner description!');

    const FullWidthBannerWidgetHref = wrapper
      .find('.full-width-banner--href')
      .first()
      .props().href;
    expect(FullWidthBannerWidgetHref).to.equal('https://this.is.a.dummy.link');
  });
});
