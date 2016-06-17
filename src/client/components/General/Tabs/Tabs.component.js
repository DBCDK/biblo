/**
 * @file
 */

import React from 'react';

import Icon from '../../General/Icon/Icon.component';

import './scss/tabs.component.scss';

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected || 0
    };
  }

  onClicked(index) {
    this.setState({selected: index});
  }

  componentWillMount() {
    // if a hashs (#something) is found and the parent component doesn't define
    // a default selection, the tab with a label matching the hash will be
    // selected
    if (window && window.location.hash.length && !this.props.selected) {
      const hash = window.location.hash;
      this.props.tabs.forEach((tab, index) => {
        const label = `#${tab.label}`;
        if (label === hash) {
          this.setState({selected: index});
        }
      });
    }
  }

  getIcon(icon) {
    return <Icon glyph={icon} />;
  }

  renderPanes() {
    const listItems = this.props.tabs.map((pane, index) => {
      const activeClass = this.state.selected === index ? 'tab active' : 'tab';
      const icon = pane.icon ? this.getIcon(pane.icon) : null;
      return (
        <li className={activeClass} key={index} >
          <a href={`#${pane.label}`} onClick={this.onClicked.bind(this, index)} >{icon}<span className="tab--label">{pane.label}</span></a>
        </li>
      );
    });

    return (
      <ul className="tabs" >
        {listItems}
      </ul>
    );
  }

  renderContent() {
    return (
      <div className="tabs--content" >
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
  tabs: []
};
