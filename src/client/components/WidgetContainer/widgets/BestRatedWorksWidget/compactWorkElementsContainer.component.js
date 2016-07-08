/**
 * @file: Compact work elements container, contains a gallery of compact works.
 */

import React, {Component, PropTypes} from 'react';
import {CompactWorkElement} from './compactWorkElement.component';
import './scss/compactWorkElementsContainer.component.scss';

export class CompactWorkElementsContainer extends Component {
  constructor() {
    super();
  }

  render() {
    const elements = this.props.works.map(work => <CompactWorkElement work={work} key={`work-${work.collection[0]}`} />);
    const classNames = 'compact-works--container' + (this.props.closed ? ' closed' : '');

    return (
      <div className={classNames}>
        {this.props.isLoading ? <p>Indlæser!</p> : <span />}
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
