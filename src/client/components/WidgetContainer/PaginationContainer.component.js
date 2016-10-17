/**
 * @file: This file implements the pagination container, which abstracts pagination away
 */

import React, {Component, PropTypes} from 'react';

import VisibilitySensor from 'react-visibility-sensor';
import Icon from '../General/Icon/Icon.component';

import plusSvg from '../General/Icon/svg/functions/plus.svg';
import crossSvg from '../General/Icon/svg/functions/close.svg';
import loadingSvg from '../General/Icon/svg/spinners/loading-spin.svg';

import './scss/PaginationContainer.component.scss';

export class PaginationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNumber: this.props.pageIncrements,
      loading: true
    };

    this.getShowMoreButton = this.getShowMoreButton.bind(this);
    this.getCloseButton = this.getCloseButton.bind(this);
    this.onGetNextPage = this.onGetNextPage.bind(this);
    this.onClosePagination = this.onClosePagination.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({loading: false});
  }

  onGetNextPage() {
    const nextPage = this.state.pageNumber + this.props.pageIncrements;
    this.props.nextPageFunction(nextPage);
    this.setState({
      pageNumber: nextPage,
      loading: true
    });
  }

  onClosePagination() {
    this.setState({
      pageNumber: this.props.pageIncrements
    });
  }

  getShowMoreButton() {
    if (this.props.lastPageIndex && this.props.lastPageIndex <= this.state.pageNumber) {
      return (
        <span className="show-more-button--no-more-pages" />
      );
    }

    return (
      <span
        className="show-more--pagination--button"
        onClick={this.onGetNextPage}
      ><Icon glyph={plusSvg} /> Vis Flere</span>
    );
  }

  getCloseButton() {
    return (
      <span
        className="close--pagination--button"
        onClick={this.onClosePagination}
      ><Icon glyph={crossSvg} /> Luk</span>
    );
  }

  render() {
    const showMoreButton = this.getShowMoreButton();
    const closeButton = this.getCloseButton();

    let width = 700;
    if (typeof window !== 'undefined') {
      width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    let loading = <span />;
    if (this.state.loading && this.props.genericLoading) {
      loading = <Icon glyph={loadingSvg} height={50} width={50} />;
    }

    return (
      <div className="pagination-container">
        <div className="pages--container">
          {this.props.pages.slice(0, this.state.pageNumber)}
          {width < 600 ?
            <VisibilitySensor onChange={(vis) => (vis && this.onGetNextPage())} delayedCall={true}>
              <span className="small-screen-sensor"> &nbsp; </span>
            </VisibilitySensor>:
            <span className="large-screen" />
          }
        </div>

        <div className="pagination-controls--spinner">
          {loading}
        </div>

        <div className="pagination-controls--container">
          <hr className="pagination-controls--spacer" />
          {showMoreButton}
          {closeButton}
          <hr className="pagination-controls--spacer" />
        </div>
      </div>
    );
  }
}

PaginationContainer.displayName = 'PaginationContainer';
PaginationContainer.propTypes = {
  nextPageFunction: PropTypes.func.isRequired,
  pages: PropTypes.array.isRequired,
  pageIncrements: PropTypes.number,
  lastPageIndex: PropTypes.number,
  genericLoading: PropTypes.bool
};
PaginationContainer.defaultProps = {
  pageIncrements: 1,
  lastPageIndex: 0,
  genericLoading: false
};
