import React from 'react';
import PropTypes from 'prop-types';
import '../scss/MultivolumeDisplay.component.scss';

export class MultiVolumeDisplay extends React.Component {
  static propTypes = {
    multivolume: PropTypes.array.isRequired,
    multivolumeTitle: PropTypes.string.isRequired,
    getMetadataAction: PropTypes.func.isRequired,
    multivolumeMetadata: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.multivolume.forEach(work => {
      this.props.getMetadataAction(work.pid[0]);
    });
  }

  getMultivolumeItems() {
    const displayedVolumes = [];

    return this.props.multivolume.map(item => {
      const pid = item.pid[0];
      const work = this.props.multivolumeMetadata[pid] || {};
      const volume = item.type[0].match(/bind \d+/ig)[0];

      if (displayedVolumes.includes(volume)) {
        return null;
      }

      displayedVolumes.push(volume);

      return (
        <div className="work-detail--series-display--edition-container" key={`sd_${pid}`}>
          <a href={`/materiale/${pid}`}>
            <img src={work.coverUrl} />
            <p>{volume}</p>
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

