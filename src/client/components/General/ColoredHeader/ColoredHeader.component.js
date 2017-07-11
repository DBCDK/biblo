import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon.component.js';

import './colored-header.scss';

export default function ColoredHeader(props) {
  const styles = {};  // Use inline styles to let widget overrule default styles.
  styles.color = props.color;
  styles.backgroundColor = props.backgroundImageUrl ? 'transparent' : props.backgroundColor;
  styles.backgroundImage = props.backgroundImageUrl ? 'url(' + props.backgroundImageUrl + ')' : null;
  const title = props.title || 'title';

  return (
    <div className="colored-header" style={styles}>
      <div className="colored-header--iconcontainer">
        {props.imageSrc &&
        <img src={props.imageSrc} alt="{title}"/>
        ||
        <Icon className="icon" height={100} width={100} glyph={props.iconGlyph}/>
        }
      </div>
      <div className="colored-header--description">
        <div className="colored-header--text">
          <h2>{title}</h2>
          {props.text || 'Test tekst'}
        </div>
      </div>
    </div>
  );
}

ColoredHeader.displayName = 'ColoredHeader';

ColoredHeader.propTypes = {
  color: PropTypes.string,
  iconGlyph: PropTypes.any,
  text: PropTypes.string,
  title: PropTypes.string,
  imageSrc: PropTypes.string,
  backgroundColor: PropTypes.string,
  backgroundImageUrl: PropTypes.string
};
