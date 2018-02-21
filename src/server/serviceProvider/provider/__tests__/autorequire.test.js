import {autoRequire} from '../lib/AutoRequire.js';
import path from 'path';

describe('Testing the Events methods', () => {
  it('requires all files in folder', () => {
    const result = autoRequire(path.join(__dirname, 'autorequirefolder'), 'mock.js');
    expect(result).toEqual(expect.arrayContaining([{default: 'mock one is required'}, {default: 'mock two is required'}]));
  });
});
