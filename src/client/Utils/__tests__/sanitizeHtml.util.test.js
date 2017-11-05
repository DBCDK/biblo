import {expect} from 'chai';
import sanitizeHtml from './../sanitizeHtml.util';

describe('Testing sanitizeHtml.util', () => {
  it('Should remove unsafe HTML', () => {
    const html = '<div><script>alert("alert");</script></div>';
    const expected = '<div></div>';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });

  it('Should remove unsafe HTML', () => {
    const html = '<script>alert("alert");</script>';
    const expected = '';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });

  it('Should remove unsafe HTML', () => {
    const html = '<script></script>';
    const expected = '';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });

  it('Should remove unsafe HTML', () => {
    const html = '<img src="src"></img>';
    const expected = '<img src="src">';
    const result = sanitizeHtml(html);

    console.log('RESRES', result);

    expect(result).to.equal(expected);
  });

  it('Should remove unsafe HTML', () => {
    const html = 'string_string_string';
    const expected = 'string_string_string';
    const result = sanitizeHtml(html);

    expect(result).to.equal(expected);
  });
});
