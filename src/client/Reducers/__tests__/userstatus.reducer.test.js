/**
 * @file
 * Testing the userstatus.reducer
 */

import {assert} from 'chai';
import assignToEmpty from '../../Utils/assign';
import {USERSTATUS_RENEW_LOAN} from '../../Constants/action.constants';

import reducer from '../userstatus.reducer';

describe('Testing the userstatus.reducer', () => {
  it('Should non-manipulated state when response is empty', () => {
    const state = {
      renewLoan: {},
      userStatus: {}
    };

    const action = {
      type: USERSTATUS_RENEW_LOAN,
      response: {}
    };

    const res = reducer(state, action);
    const stateString = JSON.stringify(state);
    const resString = JSON.stringify(res);
    assert.equal(stateString, resString);
  });

  it('Should state according to given action.response', () => {
    const state = {
      renewLoan: {},
      userStatus: {}
    };

    const action = {
      type: USERSTATUS_RENEW_LOAN,
      response: {
        loanId: 'loan-id',
        message: 'message',
        error: 'error',
        userstatusError: 'userstatusError'
      }
    };

    const res = reducer(state, action);
    assert.property(res, 'renewLoan');
    assert.property(res.renewLoan, action.response.loanId);
    assert.equal(res.renewLoan[action.response.loanId].message, action.response.message);
    assert.equal(res.renewLoan[action.response.loanId].error, action.response.error);
    assert.equal(res.renewLoan[action.response.loanId].userstatusError, action.response.userstatusError);
  });
});
