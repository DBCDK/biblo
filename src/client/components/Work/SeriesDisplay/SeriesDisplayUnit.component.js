/**
 * Renders a single work in series display
 * @param pid
 * @param coverUrl
 * @param bookTitle
 * @returns {XML}
 * @constructor
 */

import React from 'react';

export function SeriesDisplayUnit({pid, coverUrl, bookTitle}) {
  return (
    <div className="work-detail--series-display--edition-container">
      <a href={`/materiale/${pid}`}>
        <img src={coverUrl} />
        <p>{bookTitle}</p>
      </a>
    </div>
  );
}
