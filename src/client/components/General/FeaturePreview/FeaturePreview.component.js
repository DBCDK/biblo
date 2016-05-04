import React from 'react';

export default function FeaturePreview({show = false, previewKey = 'debugMode', children}) {
  if (typeof localStorage !== 'undefined' && localStorage.getItem(previewKey) !== null || show) {
    return (<span>{children}</span>);
  }

  return <span> </span>;
}

FeaturePreview.propTypes = {
  show: React.PropTypes.bool,
  previewKey: React.PropTypes.string,
  children: React.PropTypes.any.isRequired
};
