/**
 * @file: This file contains tests for the Best rated works widget.
 **/

// import libs
import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';

describe('Test BestRatedWorksWidget Widget', () => {
  it('Test BestRatedWorksWidget can render inside a WidgetContainer', () => {
    const $root = renderWidgetWithTeaspoon({
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

    const LatestReviewsWidget = $root.find('h2').text();
    expect(LatestReviewsWidget).toEqual('BestRatedWorksWidget title Test!');
  });

  it('should render a compactWorkElement when given correct props', () => {
    const workTitle = 'Fisker og båd på Roskilde Fjord';
    const $root = renderWidgetWithTeaspoon({
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

    let innerText = '';
    $root
      .find('.compact-work-element > .compact-work-element--title-and-worktype--container > .compact-work-element--title > :text')
      .each(node => (innerText = innerText.concat(node)));

    expect(innerText).toEqual(` ${workTitle}`);
  });
});

