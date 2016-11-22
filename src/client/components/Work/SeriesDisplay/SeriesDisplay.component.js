import React from 'react';
import '../scss/SeriesDisplay.component.scss';

export class SeriesDisplay extends React.Component {
  componentDidMount() {
    this.props.series.forEach(work => {
      this.props.getMetadataAction(work.pid[0]);
    });
  }

  getSeriesItems() {
    return this.props.series.map((item, index) => {
      const pid = item.pid[0];
      const work = this.props.seriesMetadata[pid] || {};

      return (
        <div className="work-detail--series-display--edition-container" key={`sd_${pid}`}>
          <a href={`/materiale/${pid}`}>
            <img src={work.coverUrl} />
            <p>{item.type[0].match(/bind \d+/ig)[0]}</p>
          </a>
        </div>
      );
    });
  }

  render() {
    const items = this.getSeriesItems();

    return (
      <div className='more-info'>
        <div className="more-info--header">Alle bind i {this.props.seriesTitle}</div>
        {items}
      </div>
    );
  }
}

SeriesDisplay.propTypes = {
  series: React.PropTypes.array.isRequired,
  seriesTitle: React.PropTypes.string.isRequired,
  getMetadataAction: React.PropTypes.func.isRequired,
  seriesMetadata: React.PropTypes.object.isRequired
};
