/**
 * @file: Tab component
 */

import React from 'react';
import './tabs.component.scss';

export default function Tabs({tabs, selected, onClick}) {
  tabs.map((tab, idx) => {
    return (
      <li className={'tab' + (idx === selected ? 'tab--selected' : '')} onClick={() => onClick(idx)}>
        <span className="tab--title">{tab}</span>
      </li>
    );
  });

  return (
    <div className="p-detail--tab-container">
      <ul className="p-detail--tabs">
        {tabs}
      </ul>
    </div>
  );
}

Tabs.displayName = 'Tabs';
Tabs.propTypes = {
  tabs: React.PropTypes.array.isRequired,
  selected: React.PropTypes.bool,
  onClick: React.PropTypes.func
};
