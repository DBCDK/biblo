import {expect} from 'chai';
import sanitizeHtml from './../sanitizeHtml.util';

describe('Testing sanitizeHtml.util', () => {
  it('Should remove content of script-tag and return safe HTML', () => {
    const html = '<div><script>alert("alert");</script></div>';
    const expected = '<div></div>';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });

  it('Should remove unsafe HTML and return empty string', () => {
    const html = '<script>alert("alert");</script>';
    const expected = '';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });

  it('Should remove script-tag and return empty string', () => {
    const html = '<script></script>';
    const expected = '';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });

  it('Should return safe img-tag', () => {
    const html = '<img src="src"></img>';
    const expected = '<img src="src">';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });

  it('Should return original string not containing HTML', () => {
    const html = 'string_string_string';
    const expected = 'string_string_string';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });
});
