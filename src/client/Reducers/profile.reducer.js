'use strict';

/**
 * @file: Profile reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {
  username: '',
  displayName: '',
  fullName: '',
  birthday: '',
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
  },
  submitState: '',
  submitProgress: 0,
  errors: [],
  displayNameExists: false,
  imageFile: null,
  UI: {
    submitState: '',
    submitProgress: 0
  }
};

let jsonData = document.getElementById('JSONDATA_USER_PROFILE');

if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
  let data = JSON.parse(jsonData.innerHTML);
  if (data.profile) {
    initialState = assignToEmpty(initialState, data.profile);
  }
}

let statusMessage = document.getElementById('JSONDATA');

if (statusMessage && statusMessage.innerHTML && statusMessage.innerHTML.length > 0) {
  let statusMessageData = JSON.parse(statusMessage.innerHTML);
  if (statusMessageData && statusMessageData.status === 'ERROR') {
    initialState = assignToEmpty(initialState, {
      birthday: statusMessageData.query.birthday,
      description: statusMessageData.query.description,
      displayName: statusMessageData.query.displayname,
      email: statusMessageData.query.email,
      fullName: statusMessageData.query.fullName,
      favoriteLibrary: {
        libraryId: statusMessageData.query.libraryId,
        loanerId: statusMessageData.query.loanerId,
        pincode: statusMessageData.query.pincode
      },
      phone: statusMessageData.query.phone,
      search: statusMessageData.query.search
    });

    statusMessageData.errors.forEach((error) => {
      initialState.errors.push(error);
    });
  }
}

export default function profileReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.GET_USER_PROFILE:
      return state;

    case types.SELECT_SUGGESTED_LIBRARY:
      const l = action.library;
      return assignToEmpty(state, {
        favoriteLibrary: {
          libraryId: l.id,
          libraryName: l.navn,
          libraryAddress: [l.adresse, l.by, l.postnr].join(', ')
        }
      });

    case types.UNSELECT_LIBRARY:
      return assignToEmpty(state, {
        favoriteLibrary: {
          libraryId: initialState.favoriteLibrary.libraryId
        }
      });

    case types.CHECK_IF_DISPLAYNAME_IS_TAKEN:
      return (
        action.displayname !== state.displayName ?
          assignToEmpty(state, {displayNameExists: action.exists}) :
          assignToEmpty(state, {displayNameExists: false})
      );

    case types.CHANGE_PROFILE_IMAGE:
      return assignToEmpty(state, {
        imageFile: action.imageFile,
        image: assignToEmpty(state.image, {
          url: assignToEmpty(state.image.url, {
            small: action.imageSrc,
            medium: action.imageSrc,
            large: action.imageSrc
          })
        })
      });

    case types.PROFILE_EDIT_SUBMIT_STATE_CHANGE:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitState: action.state
        })
      });

    case types.PROFILE_EDIT_UPLOAD_PROGRESS:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitProgress: action.progress
        })
      });

    case types.PROFILE_EDIT_SUBMIT:
      console.log(action);
      return assignToEmpty(state, {
        birthday: action.birthday,
        description: action.description,
        displayname: action.displayname,
        email: action.email,
        errors: action.errors,
        fullName: action.fullName,
        phone: action.phone
      });

    default:
      return state;
  }
}
