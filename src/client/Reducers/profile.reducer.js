'use strict';

/**
 * @file: Profile reducer
 */

import assignToEmpty from '../Utils/assign';
import {GET_USER_PROFILE} from '../Constants/action.constants';

let initialState = {
  username: '',
  displayName: '',
  favoriteLibrary: {
    libraryId: ''
  },
  description: '',
  email: '',
  phone: '',
  created: '',
  lastUpdated: '',
  hasFilledInProfile: false,
  id: -1,
  userIsLoggedIn: false
};

let jsonData = document.getElementById('JSONDATA');

if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
  let data = JSON.parse(jsonData.innerHTML);
  if (data.profile) {
    initialState = assignToEmpty(initialState, data.profile);
  }
}

export default function profileReducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case GET_USER_PROFILE:
      return state;

    default:
      return state;
  }
}
