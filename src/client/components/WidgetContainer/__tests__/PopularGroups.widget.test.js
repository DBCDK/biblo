/**
 * @file: This file contains tests for the popular groups widget
 */

import {expect} from 'chai';
import {renderWidgetWithEnzyme} from './widgetTest.utils';
import {singleGroupMock} from '../__mocks__/PopularGroups.mock';

describe('Popular groups widget!', () => {
  it('should render with empty config', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-popular-groups-widget-location',
      widgetName: 'PopularGroupsWidget',
      widgetConfig: {},
      state: {
        PopularGroupsWidget: {
          groups: [],
          isLoading: false
        }
      }
    });

    const text = wrapper.find('.popular-groups-widget').first().text();
    expect(text).to.equal(' Vis Flere');
  });

  it('should render a group when group is found in state', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-popular-groups-widget-location',
      widgetName: 'PopularGroupsWidget',
      widgetConfig: {},
      state: {
        PopularGroupsWidget: {
          groups: [singleGroupMock],
          isLoading: false
        }
      }
    });

    const renderedGroupName = wrapper.find('.popular-groups-widget--group-container').first().text();
    expect(renderedGroupName).to.include(singleGroupMock.name);
  });
});
