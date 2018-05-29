import crypto from 'crypto';
import {config} from '@dbcdk/biblo-config';

/**
 * Encrypt object
 * @param {Object} data
 */
export function encryptData(data) {
  const cipher = crypto.createCipher('aes-128-cbc', config.get('Biblo.secret'));
  return (
    cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex')
  );
}

/**
 * Decrypt object
 * @param {String} data
 */
export function decryptData(data) {
  try {
    const decipher = crypto.createDecipher(
      'aes-128-cbc',
      config.get('Biblo.secret')
    );
    const s = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    return JSON.parse(s);
  }
  catch (e) {
    return null;
  }
}


