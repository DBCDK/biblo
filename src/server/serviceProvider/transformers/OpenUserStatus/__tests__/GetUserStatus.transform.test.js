import {assert} from 'chai';

import GetUserStatusTransform from '../GetUserStatus.transform';
import responseMock from '../mocks/response.mock.json';
import data from '../mocks/data.mock.json';

describe('Testing the GetUserStatus Transform', () => {
  it('Should return object as expected  - if no pickudDate is present order.ready should be set based on orderStatus', () => {
    // Start by reading the initial data
    const response = responseMock;
    const expected = JSON.stringify(data);

    // Mock Date.now() to ensure consistency across runs.
    let _now = Date.now;
    Date.now = () => 1467928800000; // 2016-07-08

    // Run the transform
    const result = GetUserStatusTransform.responseTransform(response);
    const resultStringified = JSON.stringify(result);

    // Check the result against the saved result
    assert.equal(expected, resultStringified);

    // Restore the mock.
    Date.now = _now;
  });
});
