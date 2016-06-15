/**
 * @file Actions targetd handling communication with OpenAgency
 */

/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const getLibraryDetails = SocketClient('getLibraryDetails');

export function asyncGetLibraryDetailsAction(query) {
  return function(dispatch) {
    getLibraryDetails.response((res) => {
      dispatch(getLibraryDetailsAction(query, res.pickupAgency || {}));
    });
    getLibraryDetails.request(query);
  };
}

export function getLibraryDetailsAction(query, elements) {
  return {
    type: types.GET_LIBRARY_DETAILS,
    query,
    elements
  };
}
