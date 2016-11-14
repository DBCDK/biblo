/**
 * @file: This file contains tests for the Full Width Banner widget.
 **/

// import libs
import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';

describe('Test FullWidthBannerSlider Widget', () => {
  it('Test empty FullWidthBannerSlider widget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-FullWidthBannerSlider-location',
      widgetName: 'FullWidthBannerSliderWidget',
      widgetConfig: {
        images: [],
        title: 'empty slider test',
        showTitle: true
      }
    });

    expect($root.find('.widget--title--generic').text()).toEqual('empty slider test');
  });

  it('Test FullWidthBannerSlider widget can render with one image', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-FullWidthBannerSlider-single-pic-location',
      widgetName: 'FullWidthBannerSliderWidget',
      widgetConfig: {
        images: [{
          title: 'this is a dummy banner title',
          description: 'This is a dummy banner description!',
          desktopImageUrl: 'https://dummyimage.com/1024x200/000/fff&text=a',
          tabletImageUrl: 'https://dummyimage.com/800x300/000/fff&text=b',
          mobileImageUrl: 'https://dummyimage.com/600x300/000/fff&text=c',
          linkUrl: 'https://this.is.a.dummy.link',
          TTN: 5000,
          alt: 'Image alt text'
        }]
      }
    });

    expect($root.find('.full-width-banner--image--text--container > h2').text()).toEqual('this is a dummy banner title');
    expect($root.find('.full-width-banner--image--text--container > p').text()).toEqual('This is a dummy banner description!');
    expect($root.find('.fwbs--dots').text()).toEqual('◉');
  });

  it('Test FullWidthBannerSlider widget can render with two images', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-FullWidthBannerSlider-two-pics-location',
      widgetName: 'FullWidthBannerSliderWidget',
      widgetConfig: {
        images: [{
          title: 'And yet another dummy title',
          description: 'This is the second dummy banner description!',
          desktopImageUrl: 'https://dummyimage.com/1024x200/000/fff&text=d',
          tabletImageUrl: 'https://dummyimage.com/800x300/000/fff&text=e',
          mobileImageUrl: 'https://dummyimage.com/600x300/000/fff&text=f',
          linkUrl: 'https://this.is.a.dummi.link',
          TTN: 5000,
          alt: 'Alternative image alt text'
        }, {
          title: 'A third dummy title',
          description: 'This is yet another dummy banner description!',
          desktopImageUrl: 'https://dummyimage.com/1024x200/000/fff&text=q',
          tabletImageUrl: 'https://dummyimage.com/800x300/000/fff&text=r',
          mobileImageUrl: 'https://dummyimage.com/600x300/000/fff&text=s',
          linkUrl: 'https://this.is.a.dumme.link',
          TTN: 5000,
          alt: 'Alternative alternative image alt text'
        }]
      }
    });

    expect($root.find('.full-width-banner--image--text--container > h2').text()).toEqual('And yet another dummy title');
    expect($root.find('.full-width-banner--image--text--container > p').text()).toEqual('This is the second dummy banner description!');
    expect($root.find('.fwbs--dots').text()).toEqual('◉◎');

    $root.find('.fwbs--next').trigger('click', {});

    expect($root.find('.full-width-banner--image--text--container > h2').text()).toEqual('A third dummy title');
    expect($root.find('.full-width-banner--image--text--container > p').text()).toEqual('This is yet another dummy banner description!');
    expect($root.find('.fwbs--dots').text()).toEqual('◎◉');
  });
});
