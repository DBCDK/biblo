/**
 * @file: This file contains tests for the widgets associated with ContentPages.
 **/

// import libs
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
import snapshot from './__snapshots__/ContentPage.widgets.test.snapshots.js';

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
    expect(textInnerHTML).to.equal('Bob er sej!');
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
    expect(renderedImage.src).to.equal('bob');
    expect(renderedImage.alt).to.equal('bob2');
    expect(renderedImage.title).to.equal('bob3');
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

    const renderer = new ShallowRenderer();
    renderer.render(<WidgetContainer
      widgetLocationName={widgetLocationName}
      widgetState={widgetState}
      widgetActions={widgetActions} />);

    const result = renderer.getRenderOutput();

    expect(JSON.stringify(result)).to.equal(JSON.stringify(snapshot.ContentPageEmbeddedVideoShouldRender));
  });
});
