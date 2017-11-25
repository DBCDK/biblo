import {expect} from 'chai';
import {filterConfig} from './../filterConfig.util';
import {configMock} from './mocks/config.mock';

describe('Testing filerConfig.util', () => {
  it('Should return filtered object', () => {
    const result = filterConfig(configMock);
    const expected = {Biblo: {endpoint: 'endpoint', port: 1234}, CommunityService: {
      endpoint: 'endpoint', port: 1234, datasources: {psqlDs: {host: 'host', port: 1234}}, elasticSearch: {host: 'host'}
    }, Redis: {host: 'host', port: 1234}, UNILogin: {uniloginBasePath: 'uniloginBasePath'}, ServiceProvider: {
      bibloadmin: {endpoint: 'endpoint'}, borchk: {wsdl: 'wsdl'}, community: {endpoint: 'endpoint'},
      entitysuggest: {endpoint: 'endpoint', port: 1234}, openplatform: {endpoint: 'endpoint', smaug: 'smaug'},
      openorder: {endpoint: 'endpoint'}, openuserstatus: {endpoint: 'endpoint'}, openagency: {wsdl: 'wsdl'}
    }, Email: {IMAP: {host: 'host', port: 1234}}
    };

    expect(result).to.deep.equal(expected);
  });
});
