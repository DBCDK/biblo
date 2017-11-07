import React from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';
import parseQueryParams from '../../Utils/parseQueryParams';
import './scss/ReviewExplorerNavigation.scss';

const reviewTypes = ['alle typer', 'tekst', 'billede', 'video'];
const workTypes = ['alt muligt', 'bøger', 'film', 'spil', 'musik']; // tegneserier to be added
const orders = ['nyeste', 'mest likede', 'tilfældig'];

// We use the history API to avoid refreshing entire
// page when user navigates
const history = createHistory();

export default class ReviewExplorerNavigation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      genre: 'alle',
      workType: 'alt muligt',
      reviewType: 'alle typer',
      order: 'nyeste'
    };
  }

  componentDidMount() {
    // listen for history changes
    this.unlisten = history.listen(this.handleHistoryChange.bind(this));
  }

  componentDidUnMount() {
    // unlisten history changes
    this.unlisten();
  }

  componentWillUpdate(nextProps) {
    // check if genres has just loaded
    if (nextProps.genres !== this.props.genres) {
      this.setNavigationState(parseQueryParams(history.location.search), nextProps.genres, true);
    }
  }

  /* Will validate and set navigation state */
  setNavigationState(s, g, force) {
    const genres = g.map(genre => genre.title);
    const newState = {
      genre: genres.indexOf(s.genre) !== -1 ? s.genre : 'alle',
      workType: workTypes.indexOf(s.workType) !== -1 ? s.workType : 'alt muligt',
      reviewType: reviewTypes.indexOf(s.reviewType) !== -1 ? s.reviewType : 'alle typer',
      order: orders.indexOf(s.order) !== -1 ? s.order : 'nyeste'
    };
    if (force || JSON.stringify(this.state) !== JSON.stringify(newState)) {
      this.setState(newState);
      this.props.onChange(Object.assign({}, newState));
    }
  }

  /* Called when user interacts with dropdowns.
     Results in an Address bar change  */
  handleNavigationChange(key, value) {
    const s = {};
    s[key] = value;
    const newState = Object.assign({}, this.state, s);
    history.push(`/anmeldelser?genre=${newState.genre}&workType=${newState.workType}&reviewType=${newState.reviewType}&order=${newState.order}`);
  }

  /* Called when browser Address bar changes */
  handleHistoryChange(location) {
    this.setNavigationState(parseQueryParams(location.search), this.props.genres);
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

  renderDropDown(id, options, selected, prependText, appendText) {

    const width = this.getWidth(this.state[id], 'review-explorer-navigation--dropdown') + 26;

    return (
      <div className="review-explorer-navigation--row">
        {prependText}
        <select value={selected} style={{width}} className="review-explorer-navigation--dropdown" onChange={(e) => {
          this.handleNavigationChange(id, e.target.value);
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

    return (
      <div className="review-explorer-navigation--wrapper">
        <div className="review-explorer-navigation">
          {this.renderDropDown('genre',
            genres,
            this.state.genre,
            this.state.genre === 'alle' ? 'Vis mig' : 'Vis mig anmeldelser af',
            this.state.genre === 'alle' ? 'anmeldelser af' : '-')}
          {this.renderDropDown('workType', workTypes, this.state.workType, '', '')}
          {this.renderDropDown('reviewType',
            reviewTypes,
            this.state.reviewType,
            this.state.reviewType === 'alle typer' ? 'af' : 'lavet som',
            '')}
          {this.renderDropDown('order', orders, this.state.order, 'og vis', '')}
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
