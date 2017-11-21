/**
 * @file: This file contains tests for the Full Width Banner widget.
 **/

// import libs
import {expect} from 'chai';
import {renderWidgetWithEnzyme} from './widgetTest.utils';

describe('Test FullWidthBannerSlider Widget', () => {
  it('Test empty FullWidthBannerSlider widget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithEnzyme({
      location: 'test-FullWidthBannerSlider-location',
      widgetName: 'FullWidthBannerSliderWidget',
      widgetConfig: {
        images: [],
        title: 'empty slider test',
        showTitle: true
      }
    });

    expect($root.find('.widget--title--generic').first().text()).to.equal('empty slider test');
  });

  it('Test FullWidthBannerSlider widget can render with one image', () => {
    const $root = renderWidgetWithEnzyme({
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

    expect($root.find('.full-width-banner--image--text--container > h2').first().text()).to.equal('this is a dummy banner title');
    expect($root.find('.full-width-banner--image--text--container > p').first().text()).to.equal('This is a dummy banner description!');
    expect($root.find('.fwbs--dots').first().text()).to.equal('●');
  });

  it('Test FullWidthBannerSlider widget can render with two images', () => {
    const wrapper = renderWidgetWithEnzyme({
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


    expect(wrapper.find('.full-width-banner--image--text--container > h2').first().text()).to.equal('And yet another dummy title');
    expect(wrapper.find('.full-width-banner--image--text--container > p').first().text()).to.equal('This is the second dummy banner description!');

    let dots = wrapper.find('.fwbs--dots').children();
    expect(dots.at(0).props().className).to.equal('fwbs--image-indicator active');
    expect(dots.at(1).props().className).to.equal('fwbs--image-indicator inactive');

    wrapper.find('.fwbs--next').simulate('click');

    dots = wrapper.find('.fwbs--dots').children();
    expect(dots.at(0).props().className).to.equal('fwbs--image-indicator inactive');
    expect(dots.at(1).props().className).to.equal('fwbs--image-indicator active');
  });
});
