/**
 * Truncate text by number of lines
 * Tried 'react-truncate' but it has problems calculating size of web fonts
 * Tried 'react-text-truncate' seems to have the same problem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate-markup';
import {withWindowSizeListener} from 'react-window-size-listener';

export class CustomTruncate extends React.Component {
  static propTypes = {
    lines: PropTypes.number.isRequired,
    ellipsis: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired
  };
  render() {
    return (
      <Truncate lines={this.props.lines} ellipsis={this.props.ellipsis}>
        <span>{this.props.text}</span>
      </Truncate>
    );
  }
}

export default withWindowSizeListener(CustomTruncate);
