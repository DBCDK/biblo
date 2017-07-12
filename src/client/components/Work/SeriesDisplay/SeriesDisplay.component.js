import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../scss/MultivolumeDisplay.component.scss';

const workFields = [
  'pid',
  'coverUrlFull',
  'dcTitle',
  'titleSeries'
];

// Fang det sidste tal efter semikolon.
const editionRegex = /;.*(\d+).*$/;

export class SeriesDisplay extends Component {
  constructor(props) {
    super();
    this.state = {
      clippedSeriesTitle: this.clipSeriesTitle(props.work.titleSeries || '')
    };
  }

  componentDidMount() {
    // Get the metadata
    this.state.clippedSeriesTitle.map(title => {
      this.props.searchAction({
        seriesTitle: title,
        limit: 6,
        fields: workFields
      });
    });
  }

  clipSeriesTitle(titleSeries) {
    return titleSeries.map(title => {
      if (title.indexOf(';') < 0) {
        return title;
      }

      const chunks = title.split(' ; ');
      chunks.pop();
      return chunks.join(' ; ');
    });
  }

  render() {
    const seriesBox = this.state.clippedSeriesTitle.map((clippedSeriesTitle, idx) => {
      const results = (this.props.seriesResults[clippedSeriesTitle] || []).map(book => {
        let bookTitle = book.dcTitle[0];
        if (typeof book.titleSeries[0] === 'string') {
          const ed = editionRegex.exec(book.titleSeries[idx]);
          if (ed && ed.length > 0) {
            bookTitle = `Bog ${ed[1]}`;
          }
        }

        return (
          <div className="work-detail--series-display--edition-container" key={`${clippedSeriesTitle}_sd_${book.pid[0]}_${idx}`}>
            <a href={`/materiale/${book.pid[0]}`}>
              {(book.coverUrlFull && Array.isArray(book.coverUrlFull)) && <img src={book.coverUrlFull[0]} />}
              <p>{bookTitle}</p>
            </a>
          </div>
        );
      });

      return (
        <div className='more-info' key={clippedSeriesTitle}>
          <div className="more-info--header">Alle bøger i serien {clippedSeriesTitle}</div>
          {results}
        </div>
      );
    });

    return (
      <div className="series--container">
        {seriesBox}
      </div>
    );
  }
}

SeriesDisplay.propTypes = {
  work: PropTypes.object.isRequired,
  seriesResults: PropTypes.object.isRequired,
  searchAction: PropTypes.func.isRequired
};
