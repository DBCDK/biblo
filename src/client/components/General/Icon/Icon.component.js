'use strict';

import React from 'react';
import './icon.scss';

/**
 * Creates an SVG Icon. Import the svg file and pass it as a glyph property
 *
 * @param glyph
 * @param width
 * @param height
 * @param className
 * @returns {XML}
 * @constructor
 */

export default function Icon({glyph, width = 16, height = 16, className = 'icon'}) {
  return (
    <span className={className + '--container'} style={{width, height, position: 'relative'}}>
      <svg className={className} width={width} height={height} >
        <use xlinkHref={glyph} />
      </svg>
      <div className="icon--svg--click-overlay"></div>
    </span>
  );
}

