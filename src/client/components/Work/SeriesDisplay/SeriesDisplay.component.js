import React, {Component} from 'react';
import PropTypes from 'prop-types';
import equal from 'deep-equal';
import '../scss/MultivolumeDisplay.component.scss';

import ExpandButton from '../../General/ExpandButton/ExpandButton.component';
import {SeriesDisplayUnit} from './SeriesDisplayUnit.component';

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
    const clippedTitle = this.clipSeriesTitle(props.work.titleSeries || '');
    this.state = {
      clippedSeriesTitle: clippedTitle,
      offset: {},
      limit: 6
    };

    clippedTitle.forEach(title => {
      this.state.offset[title] = 0;
    });

    this.requestTitle = this.requestTitle.bind(this);
    this.onShowMore = this.onShowMore.bind(this);
  }

  componentDidMount() {
    // Get the metadata
    this.state.clippedSeriesTitle.map(title => {
      this.requestTitle(title);
    });
  }

  shouldComponentUpdate(nextProps) {
    return !equal(nextProps.seriesResults, this.props.seriesResults);
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

  requestTitle(title) {
    this.props.searchAction({
      seriesTitle: title,
      limit: this.state.limit,
      offset: this.state.offset[title],
      fields: workFields
    });
  }

  onShowMore(title) {
    const offset = Object.assign({}, this.state.offset);
    offset[title] = offset[title] + this.state.limit;
    this.setState({offset}, () => this.requestTitle(title));
  }

  render() {
    const seriesBox = this.state.clippedSeriesTitle.map((clippedSeriesTitle, idx) => {
      const displayMoreResults = (this.props.seriesResults[clippedSeriesTitle] || []).length % this.state.limit === 0;
      const results = (this.props.seriesResults[clippedSeriesTitle] || []).map(book => {
        let bookTitle = book.dcTitle[0];
        if (typeof book.titleSeries[idx] === 'string') {
          const ed = editionRegex.exec(book.titleSeries[idx]);
          if (ed && ed.length > 0) {
            bookTitle = `${ed[1]}. Bog`;
          }
        }

        return (
          <SeriesDisplayUnit
            key={`${clippedSeriesTitle}_sd_${book.pid[0]}`}
            pid={book.pid[0]}
            bookTitle={bookTitle}
            coverUrl={book.coverUrl}
          />
        );
      });

      return (
        <div className='more-info' key={clippedSeriesTitle}>
          <div className="more-info--header">Alle bøger i serien {clippedSeriesTitle}</div>
          {results}
          {displayMoreResults && <ExpandButton text="Vis Flere" onClick={() => this.onShowMore(clippedSeriesTitle)} />}
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
