import React from 'react';

import './content-grid.scss';

function ContentGridElement({title = 'Untitled', text='', url=null, imageUrl=null}) {

  return (
    <li className="content-grid-element">
      <a href={url}>
        <img src={imageUrl} />
        <h3>{title}</h3>
        <p>{text}</p>
      </a>
    </li>
  );

}

ContentGridElement.displayName = 'ContentGridElement';

ContentGridElement.propTypes = {
  title: React.PropTypes.string,
  text: React.PropTypes.string,
  url: React.PropTypes.string,
  imageUrl: React.PropTypes.string
};

export default ContentGridElement;
