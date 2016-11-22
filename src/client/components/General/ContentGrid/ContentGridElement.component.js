import React from 'react';
import classNames from 'classnames';

import './content-grid.scss';

function ContentGridElement({title, text='', url=null, imageUrl=null}) {
  return (
    <li className="content-grid--element">
      <a href={url}>
        <div className={classNames({image: true, wide: text})} ><img src={imageUrl} /></div>
        {title && <h3>{title}</h3>}
        {text && <p>{text}</p>}
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
