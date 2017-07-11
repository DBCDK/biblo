/**
 * @file
 * Unittesting methods in validateId.util.js
 */

import {assert} from 'chai';
import {getIdFromUrl, getIdFromFilename, validateId} from './../validateId.util';

describe('Unittesting validateId.util.js methods', () => {
  describe('validateId', () => {
    it('Should return pid', () => {
      ['1215-basis:123456', '1-hep:3', 'x-x:x'].forEach(id => {
        assert.equal(validateId(id).type, 'pid');
      });
    });
    it('Should NOT return pid', () => {
      ['-basis:123456', '1:hep-3', '-:'].forEach(id => {
        assert.notEqual(validateId(id).type, 'pid');
      });
    });
    it('Should return isbn', () => {
      ['1234567890', '1231231231231', 'x123123123', 'x12312312312x', '123-456-7890'].forEach(id => {
        assert.equal(validateId(id).type, 'isbn');
      });
    });
    it('Should Not return isbn', () => {
      ['1x23123123', '123123123', 'xx123123xx'].forEach(id => {
        assert.notEqual(validateId(id).type, 'isbn');
      });
    });
    it('Should return faust', () => {
      ['12345678', '123456789'].forEach(id => {
        assert.equal(validateId(id).type, 'faust');
      });
    });
    it('Should Not return faust', () => {
      ['1234567q', '123456', '1234567890'].forEach(id => {
        assert.notEqual(validateId(id).type, 'faust');
      });
    });
    it('Should return error', () => {
      ['123', '123456789012', 'qweasdzxc', '123:123:123', '123123:123-123'].forEach(id => {
        assert.equal(validateId(id).type, 'error');
      });
    });
  });

  describe('getIdFromUrl', () => {
    it('Should return pid', () => {
      ['http://test/1215-basis:123456.jpg', 'http://1-hep:3', 'http:://someurl/x-x:x'].forEach(url => {
        assert.equal(getIdFromUrl(url).type, 'pid');
      });
    });
    it('Should return isbn', () => {
      ['http://1234567890.jpg', '//1231231231231', 'http://some/url/123-456-7890'].forEach(url => {
        assert.equal(getIdFromUrl(url).type, 'isbn');
      });
    });
    it('Should return faust', () => {
      ['http://12345678', 'http://bum/123456789'].forEach(url => {
        assert.equal(getIdFromUrl(url).type, 'faust');
      });
    });
  });

  describe('getIdFromFile', () => {
    it('Should return pid', () => {
      ['1215-basis:123456.jpg', '1-hep:3.png', 'x-x:x.gif'].forEach(url => {
        assert.equal(getIdFromFilename(url).type, 'pid');
      });
    });
    it('Should return isbn', () => {
      ['1234567890.jpg', '1231231231231.png', '123-456-7890.gif'].forEach(url => {
        assert.equal(getIdFromFilename(url).type, 'isbn');
      });
    });
    it('Should return faust', () => {
      ['12345678.test', '123456789.jpg'].forEach(url => {
        assert.equal(getIdFromUrl(url).type, 'faust');
      });
    });
  });
});
