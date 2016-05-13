/**
 * @file
 */

import React from 'react';

import './scss/tabs.component.scss';

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected
    };
  }

  onClicked(index) {
    this.setState({selected: index});
  }

  renderPanes() {
    const listItems = this.props.tabs.map((pane, index) => {
      const activeClass = this.state.selected === index ? 'tab active' : 'tab';
      return (
        <li className={activeClass} key={index} onClick={this.onClicked.bind(this, index)}>
          {pane.label}
        </li>
      );
    });

    return (
      <ul className="tabs">
        {listItems}
      </ul>
    );
  }

  renderContent() {
    return (
      <div className="tabs--content">
        {this.props.tabs[this.state.selected].content}
      </div>
    );
  }

  render() {
    return (
      <div className="tabs-container" >
        {this.props.tabs.length >= 1 && this.renderPanes()}
        {this.props.tabs.length >= 1 && this.renderContent()}
      </div>
    );
  }
}

Tabs.propTypes = {
  selected: React.PropTypes.number,
  tabs: React.PropTypes.arrayOf(React.PropTypes.object)
};

Tabs.defaultProps = {
  selected: 0,
  tabs: []
};
