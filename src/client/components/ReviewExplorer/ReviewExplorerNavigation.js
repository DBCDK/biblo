import React from 'react';
import PropTypes from 'prop-types';
import './scss/ReviewExplorerNavigation.scss';

export default class ReviewExplorerNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'genre': 'alle',
      'workType': 'alle typer',
      'reviewType': 'alle typer',
      'order': 'nyeste'
    };

    this.props.onChange(Object.assign({}, this.state));
  }

  handleChange(key, value) {
    const s = {};
    s[key] = value;
    const newState = Object.assign(this.state, s);
    this.setState(newState);
    this.props.onChange(Object.assign({}, newState));
  }

  renderDropDown(id, options, prependText, appendText) {
    return (
      <div className="review-explorer-navigation--row">
        {prependText}
        <select className="review-explorer-navigation--dropdown" onChange={(e) => {
          this.handleChange(id, e.target.value);
        }}>
          {options.map(o => {
            return <option>{o}</option>;
          })}
        </select>
        {appendText}
      </div>
    );
  }

  render() {
    const genres = ['alle'].concat(this.props.genres && this.props.genres.map(g => g.title) || []);
    const reviewTypes = ['alle typer', 'tekst', 'billede', 'video'];
    const workTypes = ['alle typer', 'bøger', 'film', 'spil', 'musik', 'tegneserier'];
    const order = ['nyeste', 'mest likede', 'tilfældig'];

    return (
      <div className="review-explorer-navigation--wrapper">
        <div className="review-explorer-navigation">
          {this.renderDropDown('genre', genres, 'Vis mig', 'anmeldelser')}
          {this.renderDropDown('workType', workTypes, 'af', '')}
          {this.renderDropDown('reviewType', reviewTypes, 'af', '')}
          {this.renderDropDown('order', order, 'og vis', '')}
        </div>
      </div>
    );
  }
}

ReviewExplorerNavigation.propTypes = {
  genres: PropTypes.array,
  onChange: PropTypes.function,
};
