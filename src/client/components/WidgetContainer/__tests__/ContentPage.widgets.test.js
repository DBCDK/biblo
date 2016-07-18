/**
 * @file: This file contains tests for the widgets associated with ContentPages.
 **/

// import libs
import React from 'react';
import expect from 'expect';
import $ from 'teaspoon';

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

    let $root = $(component).render();

    const textInnerHTML = $root.find('.content-page--text-widget').props().dangerouslySetInnerHTML.__html;
    expect(textInnerHTML).toEqual('<h2>Bob er sej!</h2>');
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

    let $root = $(component).render();

    const renderedImage = $root.find('.content-page--image-widget > img').props();
    expect(renderedImage).toEqual({alt: 'bob2', src: 'bob', title: 'bob3'});
  });

  it('ContentPageEmbeddedVideo should render', () => {
    const widgetLocationName = 'content-page--video--test-widget-location';
    let widgetState = {
      widgetLocations: {}
    };
    const widgetActions = {};

    widgetState.widgetLocations[widgetLocationName] = {
      widgetName: 'ContentPageEmbeddedVideoWidget',
      widgetConfig: {type: 'YouTube', src: 'https://www.youtube.com/embed/qZ3fiOctBkE'}
    };

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    let $root = $(component).shallowRender();

    const EmbeddedVideoDisplayName = $root.find('.generic-widget-container')['0'].props.children[1].props.children.type.displayName;
    expect(EmbeddedVideoDisplayName).toEqual('ContentPageEmbeddedVideoWidget');
  });
});
