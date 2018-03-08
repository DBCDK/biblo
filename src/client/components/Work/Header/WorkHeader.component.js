import React from 'react';
import PropTypes from 'prop-types';

import './WorkHeader.component.scss';

export class WorkHeader extends React.Component {
  static propTypes = {
    coverUrl: PropTypes.string.isRequired,
    linkToMaterial: PropTypes.string.isRequired
  };

  state = {
    isLandscape: false,
    imageHeight: 200
  };

  image = null;

  /**
   * Called when image is loaded into the DOM.
   * Determines whether the image dimenstions are landscape or portrait.
   *
   * @param {React.SyntheticEvent} e
   */
  onLoad = (e) => {
    const isLandscape = e.target.naturalWidth > e.target.naturalHeight;
    this.setState({isLandscape, imageHeight: e.target.clientHeight});
  };

  /**
   * Whenever the component is updated the visual height of the image should be recalculated.
   */
  componentDidUpdate() {
    if (this.image && this.image.offsetHeight !== this.state.imageHeight) {
      this.setState({imageHeight: this.image.offsetHeight});
    }
  }

  render() {
    const coverUrl = this.props.coverUrl;
    const landscapeClass = this.state.isLandscape ? 'landscape' : '';
    const marginTop = 240 - this.state.imageHeight;

    return (
      <div className='work-header'>
        <div className={`work-header--background-image ${landscapeClass}`} style={{backgroundImage: `url("${coverUrl}")`}}></div>
        <div className={`work-header--foreground-image--wrapper ${landscapeClass}`}>
          <div className={`work-header--foreground-image ${landscapeClass}`} style={{marginTop: `${marginTop}px`}}>
            <a href={`${this.props.linkToMaterial}`}>
              <img className={`${landscapeClass}`} src={coverUrl} onLoad={this.onLoad} ref={(img) => this.image = img} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
