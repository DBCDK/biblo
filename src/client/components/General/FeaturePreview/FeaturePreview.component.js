import React from 'react';
import PropTypes from 'prop-types';

/**
 * Hides a feature behind a debug flag.
 * @param show
 * @param previewKey
 * @param children
 * @returns {XML}
 * @constructor
 */
export default function FeaturePreview({show = false, previewKey = 'debugMode', children}) {
  if (typeof localStorage !== 'undefined' && localStorage.getItem(previewKey) !== null || show) {
    return (<span className="feature-preview--container">{children}</span>);
  }

  return <span className="feature-preview--container feature--hidden"> </span>;
}

FeaturePreview.propTypes = {
  show: PropTypes.bool,
  previewKey: PropTypes.string,
  children: PropTypes.any.isRequired
};
