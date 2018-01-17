/**
 * @file: This file contains tests for the widgets associated with ContentPages.
 **/

// import libs
import React from 'react';
import {mount, shallow} from 'enzyme';

// import components
import WidgetContainer from '../WidgetContainer.component';

describe('Test ContentPages Widgets', () => {
  it('ContentPageText should render', () => {
    const widgetLocationName = 'test-widget-location--content-page-text';
    let widgetState = {
      widgetLocations: {}
    };
    const widgetActions = {};

    widgetState.widgetLocations[widgetLocationName] = {
      widgetName: 'ContentPageTextWidget',
      widgetConfig: {
        content: '<h2>Bob er sej!</h2>'
      }
    };

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    const wrapper = mount(component);

    const textInnerHTML = wrapper.find('.content-page--text-widget').text();
    expect(textInnerHTML).toBe('Bob er sej!'); // eslint-disable-line no-undef
  });

  it('ContentPageImage should render', () => {
    const widgetLocationName = 'content-page--image--test-widget-location';
    let widgetState = {
      widgetLocations: {}
    };
    const widgetActions = {};

    widgetState.widgetLocations[widgetLocationName] = {
      widgetName: 'ContentPageImageWidget',
      widgetConfig: {
        src: 'bob',
        alt: 'bob2',
        title: 'bob3'
      }
    };

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    const wrapper = mount(component);

    const renderedImage = wrapper.find('.content-page--image-widget').find('img').props();
    expect(renderedImage.src).toBe('bob'); // eslint-disable-line no-undef
    expect(renderedImage.alt).toBe('bob2'); // eslint-disable-line no-undef
    expect(renderedImage.title).toBe('bob3'); // eslint-disable-line no-undef
  });

  it('ContentPageEmbeddedVideo should render', () => {
    const widgetLocationName = 'content-page--video--test-widget-location';
    const widgetState = {
      widgetLocations: {}
    };
    const widgetActions = {};

    widgetState.widgetLocations[widgetLocationName] = {
      widgetName: 'ContentPageEmbeddedVideoWidget',
      widgetConfig: {type: 'YouTube', src: 'https://www.youtube.com/embed/qZ3fiOctBkE'}
    };

    const tree = shallow(<WidgetContainer
      widgetLocationName={widgetLocationName}
      widgetState={widgetState}
      widgetActions={widgetActions} />);

    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
});
