/**
 * @file
 * Testing the RenewLoan.transform
 */

import {assert} from 'chai';
import sinon from 'sinon';

import RenewLoanTransform from '../RenewLoan.transform';

import renewLoanMock from '../mocks/renewload.mock.json';

describe('Testing the RenewLoan Transform', () => {
  const connection = {
    request: {
      session: {
        passport: {
          user: {
            profile: {
              profile: {
                favoriteLibrary: {
                  libraryId: '012345',
                  loanerId: '0123456789',
                  pincode: '0123'
                }
              }
            }
          }
        }
      }
    }
  };

  it('Should return event implemented by this transform', () => {
    const expected = 'renewLoan';
    const result = RenewLoanTransform.event();

    assert.equal(expected, result);
  });

  it('Should return promise that rejects', (done) => {
    const _connection = {
      request: {
        session: {
          passport: null
        }
      }
    };

    const requestTransformResponse = RenewLoanTransform.requestTransform('renewLoan', {id: null}, _connection);
    requestTransformResponse.catch((err) => {
      assert.equal(err, 'user not logged in');
      done();
    });
  });

  it('Should return with a call to RenewLoanTransform.callServiceClient', () => {
    const expectedParams = {
      agencyId: 'DK-012345',
      userId: '0123456789',
      userPincode: '0123'
    };

    RenewLoanTransform.callServiceClient = (service, method, params) => {
      assert.equal(service, 'openuserstatus');
      assert.equal(method, 'renewLoan');
      assert.equal(JSON.stringify(params), JSON.stringify(expectedParams));
      return 'callServiceClient was invoked';
    };

    const spy = sinon.spy(RenewLoanTransform, 'callServiceClient');

    const loanId = 'abcdef';

    const requestTransformResponse = RenewLoanTransform.requestTransform('renewLoan', {id: loanId}, connection);
    assert.equal(requestTransformResponse, 'callServiceClient was invoked');

    assert.isTrue(spy.called, 'callServiceClient was called');

    // Cleanup
    delete RenewLoanTransform.callServiceClient;
  });

  it('Should return expected string upon successful renewal', () => {
    const response = renewLoanMock.success.response;
    const expected = renewLoanMock.success.result;

    const result = RenewLoanTransform.responseTransform(response, {loanId: 'ABCDEFGHIJKLMNOPQRSTU'}, connection);
    assert.equal(JSON.stringify(result), JSON.stringify(expected));
  });

  it('Should return expected string upon unsuccessful renewal', () => {
    const response = renewLoanMock.maxrenewals.response;
    const expected = renewLoanMock.maxrenewals.result;

    const result = RenewLoanTransform.responseTransform(response, {loanId: 'ABCDEFGHIJKLMNOPQRSTU'}, connection);
    assert.equal(JSON.stringify(result), JSON.stringify(expected));
  });

  it('Should it should log and return an error when try/catch statement fails', () => {
    const response = 'bad-response';
    RenewLoanTransform.logger = {
      error: () => {}
    };

    const spy = sinon.spy(RenewLoanTransform.logger, 'error');

    const result = RenewLoanTransform.responseTransform(response, {loanId: 'ABCDEFGHIJKLMNOPQRSTU'}, connection);

    const expected = 'Error when parsing response from OpenUserStatus';
    assert.equal(result.error.message, expected);

    assert.isTrue(spy.called, 'Logger was called');

    // Cleanup
    delete RenewLoanTransform.logger;
  });
});
