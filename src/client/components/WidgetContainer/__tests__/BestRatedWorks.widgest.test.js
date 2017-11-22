/**
 * @file: This file contains tests for the Best rated works widget.
 **/

// import libs
import expect from 'expect';
import {renderWidgetWithEnzyme} from './widgetTest.utils';

describe('Test BestRatedWorksWidget Widget', () => {
  it('Test BestRatedWorksWidget can render inside a WidgetContainer', () => {
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-best-works-widget-location',
      widgetName: 'BestRatedWorksWidget',
      widgetConfig: {
        title: 'BestRatedWorksWidget title Test!',
        reviewsToLoad: 15,
        showTitle: true
      },
      state: {
        BestRatedWorks: {}
      }
    });

    const LatestReviewsWidget = wrapper.find('h2').first().text();
    expect(LatestReviewsWidget).toEqual('BestRatedWorksWidget title Test!');
  });

  it('should render a compactWorkElement when given correct props', () => {
    const workTitle = 'Fisker og båd på Roskilde Fjord';
    const wrapper = renderWidgetWithEnzyme({
      location: 'test-best-works-widget-location',
      widgetName: 'BestRatedWorksWidget',
      widgetConfig: {
        title: 'BestRatedWorksWidget title Test!',
        reviewsToLoad: 15,
        showTitle: true
      },
      state: {
        BestRatedWorks: {
          isLoading: false,
          works: [{
            dcTitle: [workTitle],
            collection: ['870970-basis:06903177'],
            workType: ['book']
          }]
        }
      }
    });

    const innerText = wrapper.find('.compact-work-element').text();
    expect(innerText).toEqual(` ${workTitle}`);
  });
});

