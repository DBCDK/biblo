// import libs
import React from 'react';
import {mount} from 'enzyme';

// import components
import WidgetContainer from '../WidgetContainer.component';

export function renderWidgetWithEnzyme(params) {
  const widgetLocationName = params.location || 'test-widget-location';
  const widgetState = Object.assign({
    widgetLocations: {}
  }, params.state);

  const widgetActions = Object.assign({
    asyncGetLatestReviews: () => {},
    asyncListenForCoverImages: () => {},
    asyncGetCoverImage: () => {},
    callServiceProvider: () => {}
  }, params.actions);

  widgetState.widgetLocations[widgetLocationName] = {
    widgetName: params.widgetName,
    widgetConfig: params.widgetConfig
  };

  const component = (
    <WidgetContainer
      widgetLocationName={widgetLocationName}
      widgetState={widgetState}
      widgetActions={widgetActions} />
  );

  // return $(component).render();
  return mount(component);
}
