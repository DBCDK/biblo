import React from 'react';
import PropTypes from 'prop-types';
import '../scss/MultivolumeDisplay.component.scss';

export class MultiVolumeDisplay extends React.Component {
  componentDidMount() {
    this.props.multivolume.forEach(work => {
      this.props.getMetadataAction(work.pid[0]);
    });
  }

  getMultivolumeItems() {
    return this.props.multivolume.map(item => {
      const pid = item.pid[0];
      const work = this.props.multivolumeMetadata[pid] || {};

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
    const items = this.getMultivolumeItems();

    return (
      <div className='more-info'>
        <div className="more-info--header">Alle bind i {this.props.multivolumeTitle}</div>
        {items}
      </div>
    );
  }
}

MultiVolumeDisplay.propTypes = {
  multivolume: PropTypes.array.isRequired,
  multivolumeTitle: PropTypes.string.isRequired,
  getMetadataAction: PropTypes.func.isRequired,
  multivolumeMetadata: PropTypes.object.isRequired
};
