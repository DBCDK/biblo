import React from 'react';
import PropTypes from 'prop-types';

import ContentGridElement from './ContentGridElement.component.js';

import './content-grid.scss';

function ContentGrid({items=[]}) {

  const elements = items.map((e) => {
    return (
      <ContentGridElement
        key={e.id}
        title={e.title}
        text={e.text}
        url={e.url}
        imageUrl={e.imageUrl}
      />
    );
  });

  return (
    <div className="content-grid">
      <ul className="content-grid--wrapper">
        {elements}
      </ul>
    </div>
  );
}

ContentGrid.displayName = 'ContentGrid';

ContentGrid.propTypes = {
  items: PropTypes.array
};

export default ContentGrid;
