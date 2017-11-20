import React, {Component} from 'react';
import PropTypes from 'prop-types';
import equal from 'deep-equal';
import '../scss/MultivolumeDisplay.component.scss';
import '../scss/SeriesDisplay.component.scss';

import {SeriesDisplayUnit} from './SeriesDisplayUnit.component';
import Icon from '../../General/Icon/Icon.component';
import closeSvg from '../../General/Icon/svg/functions/close.svg';
import plusSvg from '../../General/Icon/svg/functions/plus.svg';

const workFields = ['pid', 'coverUrlFull', 'dcTitle', 'titleSeries'];

// Fang det sidste tal efter semikolon.
const editionRegex = /;\s(\d+).*$/;

export class SeriesDisplay extends Component {
  constructor(props) {
    super(props);
    const clippedTitle = this.clipSeriesTitle(props.work.titleSeries || '');

    this.state = {
      clippedSeriesTitle: clippedTitle,
      offset: {},
      limit: 6,
      pager: {}
    };

    clippedTitle.forEach(title => {
      // We are still in the constructor, the state has not been committed yet.
      this.state.offset[title] = 0; // eslint-disable-line react/no-direct-mutation-state
      this.state.pager[title] = 1; // eslint-disable-line react/no-direct-mutation-state
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

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(nextProps.seriesResults, this.props.seriesResults) || !equal(this.state, nextState);
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
      limit: this.state.limit * 3,
      offset: this.state.offset[title],
      fields: workFields
    });
  }

  onShowMore(title) {
    const offset = Object.assign({}, this.state.offset);
    const pager = Object.assign({}, this.state.pager);

    offset[title] += this.state.limit * 3;
    pager[title] += 1;

    this.setState({offset, pager}, () => this.requestTitle(title));
  }

  onClose(title) {
    const offset = Object.assign({}, this.state.offset);
    const pager = Object.assign({}, this.state.pager);

    offset[title] = 0;
    pager[title] = 1;

    this.setState({offset, pager});
  }

  render() {
    const seriesBox = this.state.clippedSeriesTitle.map((clippedSeriesTitle, idx) => {
      const displayMoreResults =
        (this.props.seriesResults[clippedSeriesTitle] || []).length >
        this.state.limit * this.state.pager[clippedSeriesTitle];
      const displayCloseButton = this.state.pager[clippedSeriesTitle] > 1;
      const amountToDisplay = this.state.pager[clippedSeriesTitle] * this.state.limit;
      const results = (this.props.seriesResults[clippedSeriesTitle] || []).slice(0, amountToDisplay).map(book => {
        let bookTitle = book.dcTitle[0];

        if (typeof book.titleSeries[idx] === 'string') {
          const ed = editionRegex.exec(book.titleSeries[idx]);
          if (ed && ed.length > 0) {
            bookTitle = `${ed[1]}. Bog`;
          }
        }

        const key = `${clippedSeriesTitle}_sd_${book.pid[0]}`;

        bookTitle = bookTitle.length > 20 ? `${bookTitle.substring(0, 17)}...` : bookTitle;
        return <SeriesDisplayUnit key={key} pid={book.pid[0]} bookTitle={bookTitle} coverUrl={book.coverUrl} />;
      });

      return (
        <div className="more-info" key={clippedSeriesTitle}>
          <div className="more-info--header">Alle bøger i serien {clippedSeriesTitle}</div>
          {results}
          <div className="buttons">
            {displayMoreResults && (
              <span className="show-more--button" onClick={() => this.onShowMore(clippedSeriesTitle)}>
                <Icon glyph={plusSvg} />VIS FLERE
              </span>
            )}
            {displayCloseButton && (
              <span className="close--button" onClick={() => this.onClose(clippedSeriesTitle)}>
                <Icon glyph={closeSvg} />LUK
              </span>
            )}
          </div>
        </div>
      );
    });

    return <div className="series--container">{seriesBox}</div>;
  }
}

SeriesDisplay.propTypes = {
  work: PropTypes.object.isRequired,
  seriesResults: PropTypes.object.isRequired,
  searchAction: PropTypes.func.isRequired
};
