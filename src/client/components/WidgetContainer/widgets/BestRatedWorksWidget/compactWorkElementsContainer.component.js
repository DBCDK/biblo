/**
 * @file: Compact work elements container, contains a gallery of compact works.
 */

// Libraries
import React, {Component, PropTypes} from 'react';

// Components
import {CompactWorkElement} from './compactWorkElement.component';
import Icon from '../../../General/Icon/Icon.component';

// SVG
import spinnerSvg from '../../../General/Icon/svg/spinners/loading-spin.svg';

// Styles
import './scss/compactWorkElementsContainer.component.scss';

export class CompactWorkElementsContainer extends Component {
  render() {
    const elements = this.props.works.map(work => <CompactWorkElement work={work} key={`work-${work.collection[0]}`}/>);
    const classNames = 'compact-works--container' + (this.props.closed ? ' closed' : '');

    let spinner = <span />;

    if (this.props.isLoading) {
      spinner = (
        <div className="compact-works--spinner-container">
          <Icon glyph={spinnerSvg} height={150} width={150}/>
        </div>);
    }

    return (
      <div className={classNames}>
        {spinner}
        {elements}
      </div>
    );
  }
}

CompactWorkElementsContainer.displayName = 'CompactWorkElementsContainer';

CompactWorkElementsContainer.propTypes = {
  works: PropTypes.array,
  closed: PropTypes.bool,
  isLoading: PropTypes.bool
};

CompactWorkElementsContainer.defaultProps = {
  works: [],
  closed: true,
  isLoading: false
};
