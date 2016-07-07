import {assert} from 'chai';

import GetUserStatusTransform from '../GetUserStatus.transform';
import responseMock from 'json!../mocks/response.mock.json';
import data from 'json!../mocks/data.mock.json';

describe('Testing the GetUserStatus Transform', () => {
  it('Should return object as expected  - if no pickudDate is present order.ready should be set based on orderStatus', () => {
    const response = responseMock;
    const expected = JSON.stringify(data);
    const result = GetUserStatusTransform.responseTransform(response);
    const resultStringified = JSON.stringify(result);

    assert.equal(expected, resultStringified);
  });
});
