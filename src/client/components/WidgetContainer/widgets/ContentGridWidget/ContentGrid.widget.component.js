/**
 * @file: ContentGrid Widget, renders a content grid based on the react component of the same name.
 */

import React, {Component, PropTypes} from 'react';
import ContentGrid from '../../../General/ContentGrid/ContentGrid.component';

export class ContentGridWidget extends Component {
  render() {
    return (
      <ContentGrid items={this.props.widgetConfig.items} />
    );
  }
}

ContentGridWidget.displayName = 'ContentGridWidget';
ContentGridWidget.propTypes = {
  widgetConfig: PropTypes.object.isRequired
};
