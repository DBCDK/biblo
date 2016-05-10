/**
 * @file
 */

import React from 'react';

import './tabs.component.scss';

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected || 0
    };
  }

  onClick(index) {
    this.setState({selected: index});
  }

  renderPanes() {
    const listItems = this.props.tabs.map((pane, index) => {
      const activeClass = this.state.selected === index ? 'tab active' : 'tab';
      return (
        <li className={activeClass} key={index} onClick={this.onClick.bind(this, index)}>
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
        {this.renderPanes()}
        {this.renderContent()}
      </div>
    );
  }
}

Tabs.propTypes = {
  selected: React.PropTypes.number,
  tabs: React.PropTypes.array
};
