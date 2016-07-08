/**
 * @file: A collection of widgets, collected for ease of use in WidgetContainer
 */

import {LatestReviewsWidget} from './LatestReviews/LatestReviews.widget.component';
import {DummyWidget} from './DummyWidget/Dummy.widget.component';
import {ColoredHeaderWidget} from './ColoredHeaderWidget/ColoredHeader.widget.component';
import {ContentGridWidget} from './ContentGridWidget/ContentGrid.widget.component';
import {ContentPageTextWidget} from './ContentPageTextWidget/ContentPageText.widget.component';
import {ContentPageImageWidget} from './ContentPageImageWidget/ContentPageImage.widget.component';
import {ContentPageEmbeddedVideoWidget} from './ContentPageEmbeddedVideoWidget/ContentPageEmbeddedVideo.widget.component';
import {FullWidthBannerWidget} from './FullWidthBannerWidget/FullWidthBanner.widget.component';
import {BestRatedWorksWidget} from './BestRatedWorksWidget/BestRatedWorks.widget.component';

const widgetComponents = {
  BestRatedWorksWidget,
  LatestReviewsWidget,
  DummyWidget,
  FullWidthBannerWidget,
  ColoredHeaderWidget,
  ContentGridWidget,
  ContentPageTextWidget,
  ContentPageImageWidget,
  ContentPageEmbeddedVideoWidget
};

export default widgetComponents;
