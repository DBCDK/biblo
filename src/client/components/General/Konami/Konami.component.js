'use strict';

import React from 'react';

import './konami.component.scss';

const konamiCombo = '[38,38,40,40,37,39,37,39,66,65]';

export default class Konami extends React.Component {
  constructor() {
    super();
    this.state = {
      showing: false,
      combo: []
    };
  }

  shakeBody() {
    let beforeClass = document.getElementsByTagName('BODY')[0].className;
    document.getElementsByTagName('BODY')[0].className = beforeClass + ' shakeit';
    setTimeout(() => {
      document.getElementsByTagName('BODY')[0].className = beforeClass;
    }, 500);
  }

  componentDidMount() {
    let self = this;

    document.onkeydown = (e) => {
      e = e || window.event;
      let charCode = (typeof e.which === 'number') ? e.which : e.keyCode;
      self.state.combo.push(charCode);
      if (konamiCombo === JSON.stringify(self.state.combo.slice(Math.max(self.state.combo.length - 10, 1)))) {
        self.shakeBody();
      }
    };
  }

  render() {
    return (<span />);
  }
}

Konami.displayName = 'Konami';
