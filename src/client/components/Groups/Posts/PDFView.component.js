import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../General/Icon/Icon.component.js';
import pdfDarkSvg from '../../General/Icon/svg/functions/pdf_dark.svg';

export const PDFViewComponent = ({pdf, isOwner}) => {
  if (!pdf) {
    return <span className="pdf-not-found"> </span>;
  }

  if (pdf.scans && pdf.scans.length) {
    const message = isOwner ? 'Der er fundet en virus i denne PDF, kontakt support.' : 'Denne PDF er ikke tilgængelig.';

    return (
      <div className="pdf-container">
        <div className="post--attachment--pdf">{message}</div>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      <div className="post--attachment--pdf">
        <div className="pdf-image">
          <Icon glyph={pdfDarkSvg} height={60} width={60} />
        </div>

        <div className="pdf-open--container">
          <div className="pdf-open-button">
            <a href={`/pdf/${pdf.postPdfAttachment}`} target="_blank">
              Åbn PDF&apos;en
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

PDFViewComponent.displayName = 'PDFViewComponent';
PDFViewComponent.propTypes = {
  pdf: PropTypes.object,
  isOwner: PropTypes.bool
};
