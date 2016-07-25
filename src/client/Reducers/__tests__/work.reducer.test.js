/**
 * @file
 * Unittesting the methods in work.reducer.js
 */

import {assert} from 'chai';

import {GET_WORK_METADATA_FOR_PERSONAL_REVIEWS} from '../../Constants/action.constants';
import {GET_WORK_METADATA_FOR_PERSONAL_REVIEWS_MOCK} from './mocks/work.reducer.mock';
import WorkReducer from '../work.reducer';

describe('Unittesting the methods in work.reducer.js', () => {
  const initialState = {
    workMetadataOrderedByPid: {}
  };

  it('Should ensure that data is expected when returned from reducer', () => {
    const action = {
      type: GET_WORK_METADATA_FOR_PERSONAL_REVIEWS,
      response: {
        data: GET_WORK_METADATA_FOR_PERSONAL_REVIEWS_MOCK,
        statusCode: 200
      }
    };

    const result = WorkReducer(initialState, action);

    const expectedKeys = ['870970-basis:51115155', '870970-basis:22252852', '870970-basis:22467859'];
    assert.deepEqual(Object.keys(result.workMetadataOrderedByPid), expectedKeys);

    expectedKeys.forEach((key, index) => {
      const expectedData = GET_WORK_METADATA_FOR_PERSONAL_REVIEWS_MOCK[index];
      const resultData = result.workMetadataOrderedByPid[key];

      assert.equal(expectedData.dcTitle, resultData.dcTitle);
      assert.equal(expectedData.dcTitleFull, resultData.dcTitleFull);
      assert.equal(expectedData.coverUrlFull, resultData.coverUrl);
      assert.equal(expectedData.workType, resultData.workType);
    });
  });
});
