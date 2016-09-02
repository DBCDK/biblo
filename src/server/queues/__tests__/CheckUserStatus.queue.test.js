import {assert} from 'chai';
import sinon from 'sinon';

import {filterItems} from './../CheckUserStatus.queue';

describe('Testing CheckUserStatus.queue', () => {
  const serviceProviderMock = {
    trigger: () => {}
  };

  it('Should return userMessages.Items empty array when empty array is given', () => {
    const userMessages = {
      Items: []
    };

    const userStatusFlattened = [];

    const result = filterItems(userMessages, userStatusFlattened, serviceProviderMock);

    assert.isArray(result);
    assert.lengthOf(result, 0);
  });

  it('Should return empty array when no match is found in userStatusFlattened and the item should be deleted', () => {
    const spy = sinon.spy(serviceProviderMock, 'trigger');
    const userMessages = {
      Items: [{
        orderId: 'some-id'
      }]
    };

    const userStatusFlattened = [];

    const result = filterItems(userMessages, userStatusFlattened, serviceProviderMock);

    assert.isTrue(spy.called, 'serviceProvider was invoked');
    assert.isArray(result);
    assert.lengthOf(result, 0);
  });

  it('Should not return empty array when a match is found in userStatusFlattened', () => {
    const userMessages = {
      Items: [{
        loanId: 'some-loan-id'
      }]
    };

    const userStatusFlattened = [{
      loanId: 'some-loan-id'
    }];

    const result = filterItems(userMessages, userStatusFlattened, serviceProviderMock);

    assert.isArray(result);
    assert.lengthOf(result, 1);
  });

  it('Should ignore the item if it has already been marked as deleted', () => {
    const userMessages = {
      Items: [{
        loanId: 'some-loan-id',
        markAsDeleted: 1472651104
      }]
    };

    const userStatusFlattened = [];

    const result = filterItems(userMessages, userStatusFlattened, serviceProviderMock);

    assert.isArray(result);
    assert.lengthOf(result, 1);
  });
});
