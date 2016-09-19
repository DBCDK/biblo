/**
 * @file
 * Testing the userstatus.reducer
 */

import {assert} from 'chai';
import sinon from 'sinon';
import {USERSTATUS_RENEW_LOAN, USERSTATUS_GET_STATUS} from '../../Constants/action.constants';

import reducer from '../userstatus.reducer';

describe('Testing the userstatus.reducer', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

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

  it('Should log an error when errors.length > 1', () => {
    const spy = sandbox.spy(console, 'error');

    const state = {
      renewLoan: {},
      userStatus: {}
    };

    const action = {
      type: USERSTATUS_GET_STATUS,
      response: {
        errors: ['a']
      }
    };

    assert.isFalse(spy.called);
    reducer(state, action);
    assert.isTrue(spy.called);
    const args = spy.firstCall.args;
    assert.equal(args[0], 'Error in response from OpenUserStatus');
  });

  it('Should log an error when response.result is undefined', () => {
    const spy = sandbox.spy(console, 'error');

    const state = {
      renewLoan: {},
      userStatus: {}
    };

    const action = {
      type: USERSTATUS_GET_STATUS,
      response: {
        errors: null
      }
    };

    assert.isFalse(spy.called);
    reducer(state, action);
    assert.isTrue(spy.called);
    const args = spy.firstCall.args;
    assert.equal(args[0], 'Error in response from OpenUserStatus');
  });

  it('Should assign response.result ito state.userStatus', () => {
    const state = {
      renewLoan: {},
      userStatus: {}
    };

    const action = {
      type: USERSTATUS_GET_STATUS,
      response: {
        errors: null,
        result: {
          someuserstatus: 'someuserstatus'
        }
      }
    };

    const res = reducer(state, action);

    const responseString = JSON.stringify(action.response.result);
    const resultString = JSON.stringify(res.userStatus);

    assert.equal(responseString, resultString);
  });

  it('Should return state as it is when no macthing action is found', () => {
    const state = {
      renewLoan: {},
      userStatus: {}
    };

    const action = {
      type: 'NO_MATCHING_ACTION',
      response: {
        errors: null,
        result: {
          someuserstatus: 'someuserstatus'
        }
      }
    };

    const res = reducer(state, action);

    const stateString = JSON.stringify(state);
    const resultString = JSON.stringify(res);

    assert.equal(stateString, resultString);
  });
});
