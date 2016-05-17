/**
 * @file: Entity Suggest library reducer
 */

import assignToEmpty from '../Utils/assign';
import parseJsonData from '../Utils/parseJsonData.js';
import {FIND_LIBRARIES} from '../Constants/action.constants';

let initialState = {
  query: 'nil',
  nil: [],
  errorStateObject: {}
};

let errorArr = parseJsonData('JSONDATA', 'errors');
let errorObj = {};
if (Array.isArray(errorArr)) {
  errorArr.forEach((err) => {
    errorObj[err.field] = err.errorMessage;
  });
}
else {
  errorObj = errorArr;
}

initialState.errorStateObject = errorObj;

export default function entitySuggestReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case FIND_LIBRARIES: {
      let newState = {
        query: action.query
      };
      newState[action.query] = action.elements;
      return assignToEmpty(state, newState);
    }

    default: {
      return state;
    }
  }
}
