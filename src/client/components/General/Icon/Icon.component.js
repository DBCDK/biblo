import React from 'react';
import PropTypes from 'prop-types';
import './icon.scss';

/**
 * Creates an SVG Icon. Import the svg file and pass it as a glyph property
 *
 * @param glyph
 * @param svgLink
 * @param width
 * @param height
 * @param className
 * @returns {XML}
 * @constructor
 */
export default class Icon extends React.Component {
  static propTypes = {
    glyph: PropTypes.any,
    svgLink: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    width: 16,
    height: 16,
    className: 'icon'
  };

  state = {
    isClient: false
  };

  componentDidMount() {
    this.setState({isClient: true});
  }

  render() {
    let innerIcon = this.state.isClient && this.props.glyph ? (
      <svg className={this.props.className} viewBox={this.props.glyph.viewBox}>
        <use xlinkHref={`#${this.props.glyph.id}`} />
      </svg>
    ) : null;

    if (this.props.svgLink && this.state.isClient) {
      innerIcon = (<img src={this.props.svgLink} className='svg' height={this.props.height} />);
    }

    return (
      <div className={`${this.props.className}--container`} style={{
        width: this.props.width, height: this.props.height
      }}>
        {innerIcon}
        <div className='icon--svg--click-overlay'></div>
      </div>
    );
  }
}
