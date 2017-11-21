/**
 * @file: This file contains tests for the generic widget container.
 **/

// import libs
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

// import components
import WidgetContainer from '../WidgetContainer.component';

describe('Test generic WidgetContainer', () => {
  it('Test WidgetContainer can render with no widgets', () => {
    const widgetLocationName = 'test-widget-location';
    const widgetState = {
      widgetLocations: {}
    };
    const widgetActions = {};

    const component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    const wrapper = mount(component);
    const text = wrapper.find(`.${widgetLocationName}--generic-widget-container`).first().text();

    expect(text).to.equal('');
  });

  it('should render dummy widget', () => {
    const widgetLocationName = 'test-widget-location';
    const widgetState = {
      DummyWidget: {},
      widgetLocations: {}
    };
    const widgetActions = {
      callServiceProvider() {}
    };

    widgetState.widgetLocations[widgetLocationName] = {widgetName: 'DummyWidget', widgetConfig: {}};

    const component = (
      <WidgetContainer
        widgetLocationName={widgetLocationName}
        widgetState={widgetState}
        widgetActions={widgetActions} />
    );

    const expected = 'This is a dummy widget!';
    const wrapper = mount(component);
    const text = wrapper.find('.dummy-widget').first().text();

    expect(text).to.equal(expected);
  });
});
