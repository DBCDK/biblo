/**
 * @file: Group actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const findSuggestedLibrary = SocketClient('findSuggestedLibrary');

export function asyncFindSuggestedLibraryAction(query) {
  return function(dispatch) {
    if (query.length > 2) {
      findSuggestedLibrary.response((res) => dispatch(findSuggestedLibraryAction(query, res.body.suggestions)));
      findSuggestedLibrary.request(query);
    }
    else {
      dispatch(findSuggestedLibraryAction('nil', []));
    }
  };
}

export function findSuggestedLibraryAction(query, elements) {
  return {
    type: types.FIND_LIBRARIES,
    query,
    elements
  };
}

export function asyncSelectSuggestedLibrary(library) {
  return function(dispatch) {
    dispatch(findSuggestedLibraryAction('nil', []));
    dispatch(selectLibrary(library));
  };
}

export function selectLibrary(library) {
  return {
    type: types.SELECT_SUGGESTED_LIBRARY,
    library
  };
}

export function unselectLibrary() {
  return {
    type: types.UNSELECT_LIBRARY
  };
}
