import React from 'react';
import PropTypes from 'prop-types';

export default class Login extends React.Component {
  getCurrentLocation() {
    return window.location.pathname + window.location.search;
  }
  getDestination() {
    return '/login?destination=' + encodeURIComponent(this.getCurrentLocation());
  }

  render() {
    return <a href={this.getDestination()}>{this.props.children}</a>;
  }
}

Login.propTypes = {
  children: PropTypes.any
};
