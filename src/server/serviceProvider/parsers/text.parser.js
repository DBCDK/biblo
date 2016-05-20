import AutoLinker from 'autolinker';
import twemoji from 'twemoji';
import sanitizeHtml from 'sanitize-html';

const autolinker = new AutoLinker({
  phone: false,
  twitter: false,
  hashtag: false
});

/**
 * Parse a text to include links and emojis.
 * @param text {String}
 * @param links {Bool}
 * @returns {String}
 */
export default function textParser(text, links = true) {
  // Make sure the text is clean when it comes in
  text = sanitizeHtml(text, {
    allowedTags: []
  });

  // Add links to the text
  if (links) {
    text = autolinker.link(text);
  }

  // Add emojis to the text
  text = twemoji.parse(text, {
    className: 'twemoji'
  });

  return text;
}
