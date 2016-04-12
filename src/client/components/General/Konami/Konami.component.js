/**
 * @file: Easter egg, when the konami code is entered (up, up, down, dow, left, right, left, right, b, a), an easter egg appears.
 */

import React from 'react';

import './konami.component.scss';

const konamiCombo = '[38,40,40,37,39,37,39,66,65]';

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

  playSound() {
    const audio = new Audio('/konami.mp3');
    audio.play();
  }

  componentDidMount() {
    let self = this;

    document.onkeydown = (e) => {
      e = e || window.event;
      let charCode = (typeof e.which === 'number') ? e.which : e.keyCode;
      self.state.combo.push(charCode);
      if (konamiCombo === JSON.stringify(self.state.combo.slice(Math.max(self.state.combo.length - 9, 1)))) {
        self.shakeBody();
        self.playSound();
      }
    };
  }

  render() {
    return (<span />);
  }
}

Konami.displayName = 'Konami';
