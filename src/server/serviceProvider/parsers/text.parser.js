'use strict';

import AutoLinker from 'autolinker';
import twemoji from 'twemoji';
import sanitizeHtml from 'sanitize-html';

const autolinker = new AutoLinker();

export default function textParser(text) {
  // Make sure the text is clean when it comes in
  text = sanitizeHtml(text, {
    allowedTags: []
  });
  
  // Add links to the text
  text = autolinker.link(text);
  
  // Add emojis to the text
  text = twemoji.parse(text, {
    className: 'twemoji'
  });

  return text;
}
