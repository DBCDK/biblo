'use strict';

import AutoLinker from 'autolinker';
import twemoji from 'twemoji';
const autolinker = new AutoLinker();

export default function textParser(text) {
  text = autolinker.link(text);
  text = twemoji.parse(text, {
    className: 'twemoji'
  });
  return text;
}
