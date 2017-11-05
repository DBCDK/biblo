import DOMPurify from 'dompurify';

export default function sanitize(_html) {
  let html = '';

  try {
    if (typeof window !== 'undefined') {
      html = DOMPurify.sanitize(_html);
    }
  }
  catch (e) {
    console.error(e); // eslint-disable-line
  }

  return html;
}
