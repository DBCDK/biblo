import React from 'react';
import PropTypes from 'prop-types';
import './scss/ReviewExplorerNavigation.scss';

export default class ReviewExplorerNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      genre: 'alle',
      workType: 'alt muligt',
      reviewType: 'alle typer',
      order: 'nyeste'
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

  // a hack to get the width of the select element
  getWidth(text, className) {
    var tmp = document.createElement('div');
    tmp.className = className;
    tmp.innerHTML = text;
    tmp.style.visibility = 'hidden';
    tmp.style.display = 'inline-block';
    tmp.style.position = 'absolute';
    document.body.appendChild(tmp);
    const width = tmp.clientWidth;
    document.body.removeChild(tmp);
    return width;
  }

  renderDropDown(id, options, prependText, appendText) {

    const width = this.getWidth(this.state[id], 'review-explorer-navigation--dropdown') + 18;

    return (
      <div className="review-explorer-navigation--row">
        {prependText}
        <select style={{width}} className="review-explorer-navigation--dropdown" onChange={(e) => {
          this.handleChange(id, e.target.value);
        }}>
          {options.map((o, idx) => {
            return <option key={idx}>{o}</option>;
          })}
        </select>
        {appendText}
      </div>
    );
  }

  render() {
    const sortedGenres = this.props.genres && this.props.genres.length ? this.props.genres.map(g => g.title) : [];
    sortedGenres.sort();
    const genres = ['alle'].concat(sortedGenres);
    const reviewTypes = ['alle typer', 'tekst', 'billede', 'video'];
    const workTypes = ['alt muligt', 'bøger', 'film', 'spil', 'musik']; // tegneserier to be added
    const order = ['nyeste', 'mest likede', 'tilfældig'];

    return (
      <div className="review-explorer-navigation--wrapper">
        <div className="review-explorer-navigation">
          {this.renderDropDown('genre',
            genres,
            this.state.genre === 'alle' ? 'Vis mig' : 'Vis mig anmeldelser af',
            this.state.genre === 'alle' ? 'anmeldelser af' : '-')}
          {this.renderDropDown('workType', workTypes, '', '')}
          {this.renderDropDown('reviewType',
            reviewTypes,
            this.state.reviewType === 'alle typer' ? 'af' : 'lavet som',
            '')}
          {this.renderDropDown('order', order, 'og vis', '')}
        </div>
      </div>
    );
  }
}
ReviewExplorerNavigation.displayName = 'ReviewExplorerNavigation';
ReviewExplorerNavigation.propTypes = {
  genres: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
