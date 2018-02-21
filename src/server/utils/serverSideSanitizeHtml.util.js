import {log} from 'dbc-node-logger';
import DOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';

export default function sanitize(_html) {
  let html = '';

  try {
    if (typeof window !== 'undefined') {
      html = DOMPurify.sanitize(_html);
    }
    else {
      const window = (new JSDOM('')).window;
      const purifier = DOMPurify(window);
      html = purifier.sanitize(_html);
    }
  }
  catch (e) {
    log.error(e); // eslint-disable-line
  }

  return html;
}
