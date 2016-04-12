import React from 'react';

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
      <ul>
        {elements}
      </ul>
    </div>
  );
}

ContentGrid.displayName = 'ContentGrid';

ContentGrid.propTypes = {
  items: React.PropTypes.array
};

export default ContentGrid;
