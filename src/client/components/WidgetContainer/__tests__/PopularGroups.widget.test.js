/**
 * @file: This file contains tests for the popular groups widget
 */

import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';
import {singleGroupMock} from '../__mocks__/PopularGroups.mock';

describe('Popular groups widget!', () => {
  it('should render with empty config', () => {
    const $root = renderWidgetWithTeaspoon({
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

    expect($root.find('.popular-groups-widget').text()).toEqual(' VIS FLERE');
  });

  it('should render a group when group is found in state', () => {
    const $root = renderWidgetWithTeaspoon({
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

    const renderedGroup = $root.find('.popular-groups-widget--group-container').unwrap().innerHTML;
    expect(renderedGroup).toContain(singleGroupMock.name);
  });
});
