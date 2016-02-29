'use strict';

/**
 * @file: Profile reducer
 */

import assignToEmpty from '../Utils/assign';
import {GET_USER_PROFILE, SELECT_SUGGESTED_LIBRARY, UNSELECT_LIBRARY} from '../Constants/action.constants';

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
  userIsLoggedIn: false,
  image: {
    url: {
      small: '/no_profile.png',
      medium: '/no_profile.png',
      large: '/no_profile.png'
    }
  }
};

let jsonData = document.getElementById('JSONDATA_USER_PROFILE');

if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
  let data = JSON.parse(jsonData.innerHTML);
  if (data.profile) {
    initialState = assignToEmpty(initialState, data.profile);
  }
}

export default function profileReducer(state = initialState, action={}) {
  Object.freeze(state);
  switch (action.type) {
    case GET_USER_PROFILE:
      return state;

    case SELECT_SUGGESTED_LIBRARY:
      const l = action.library;
      return assignToEmpty(state, {
        favoriteLibrary: {
          libraryId: l.id,
          libraryName: l.navn,
          libraryAddress: [l.adresse, l.by, l.postnr].join(', ')
        }
      });

    case UNSELECT_LIBRARY:
      return assignToEmpty(state, {
        favoriteLibrary: {
          libraryId: initialState.favoriteLibrary.libraryId
        }
      });

    default:
      return state;
  }
}
