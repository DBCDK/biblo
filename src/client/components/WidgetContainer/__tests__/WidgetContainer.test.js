/**
 * @file: This file contains tests for the generic widget container.
 **/

// import libs
import React from 'react';
import expect from 'expect';
import $ from 'teaspoon';

// import components
import WidgetContainer from '../WidgetContainer.component';

describe('Test generic WidgetContainer', () => {
  it('Test WidgetContainer can render with no widgets', () => {
    const widgetLocationName = 'test-widget-location';
    const widgetState = {
      widgetLocations: {}
    };
    const widgetActions = {};

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    let $root = $(component).render();

    const emptyWidgetContainer = $root.find(`.${widgetLocationName}--generic-widget-container`).text();
    expect(emptyWidgetContainer).toEqual('');
  });

  it('should render dummy widget', () => {
    const widgetLocationName = 'test-widget-location';
    let widgetState = {
      DummyWidget: {},
      widgetLocations: {}
    };
    const widgetActions = {
      callServiceProvider() {}
    };

    widgetState.widgetLocations[widgetLocationName] = {widgetName: 'DummyWidget', widgetConfig: {}};

    let component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    let $root = $(component).render();

    const dummyWidgetContainer = $root.find('.dummy-widget').text();
    expect(dummyWidgetContainer).toEqual('This is a dummy widget!');
  });
});
