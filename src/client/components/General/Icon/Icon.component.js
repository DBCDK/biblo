import React from 'react';
import './icon.scss';

/**
 * Creates an SVG Icon. Import the svg file and pass it as a glyph property
 *
 * @param glyph
 * @param width
 * @param height
 * @param className
 // * @param svgLink
 * @returns {XML}
 * @constructor
 */
export default function Icon({glyph, svgLink, width = 16, height = 16, className = 'icon'}) {

  let innerIcon = (
    <svg className={className} width={width} height={height} >
      <use xlinkHref={glyph} />
    </svg>
  );

  if (svgLink) {
    innerIcon = (
      <img src={svgLink} className='svg' height={height}/>
    );
  }

  return (
    <span className={className + '--container'} style={{width, height, position: 'relative'}}>
      {innerIcon}
      <div className='icon--svg--click-overlay'></div>
    </span>
  );
}

Icon.propTypes = {
  glyph: React.PropTypes.any,
  svgLink: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  className: React.PropTypes.string
};
