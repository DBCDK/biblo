import React from 'react';

export class SeriesDisplay extends React.Component {
  getSeriesItems() {
    return this.props.series.map((item, index) => {
      return (
        <div key={index}>
          <a href={`/materiale/${item.pid[0]}`}>{item.type[0].match(/bind \d/ig)[0]}</a>
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
  seriesTitle: React.PropTypes.string.isRequired
};
