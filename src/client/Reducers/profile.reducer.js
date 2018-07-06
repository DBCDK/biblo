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
  userIsLoggedOut: false, // user is actively logged out (use this to display warning)
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
  isModerator: false,
  reviews: {},
  userMessages: {
    messages: [],
    unreadMessages: 0
  },
  UI: {
    submitState: '',
    submitProgress: 0
  },
  deleted: false
};

if (typeof window !== 'undefined') {
  let jsonData = document.getElementById('JSONDATA_USER_PROFILE');
  if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
    let data = JSON.parse(jsonData.innerHTML);
    if (data.profile) {
      let profileData = Object.assign({}, data.profile);
      if (data.profile.userMessages) {
        // fix double message issue
        let seenIds = [];
        let filtredMeasseges = Object.assign({}, data.profile.userMessages, {messages: []});
        data.profile.userMessages.messages.map(msg => {
          if (!seenIds.includes(msg.commentId)) {
            msg.commentId ? seenIds.push(msg.commentId) : null; // check if msg have a commentId before pushing to renderedIds
            filtredMeasseges.messages.push(msg);
          }
        });
        filtredMeasseges.unreadMessages = Math.round(filtredMeasseges.unreadMessages / 2);
        profileData = Object.assign({}, data.profile, {userMessages: filtredMeasseges});
      }

      initialState = assignToEmpty(initialState, profileData);
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
}

export default function profileReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {

    case types.GET_USER_PROFILE: {
      return state;
    }

    case types.SELECT_SUGGESTED_LIBRARY: {
      const l = action.library;
      return assignToEmpty(state, {
        favoriteLibrary: {
          libraryId: l.id,
          libraryName: l.navn,
          libraryAddress: [l.adresse, l.by, l.postnr].join(', ')
        }
      });
    }

    case types.UNSELECT_LIBRARY: {
      return assignToEmpty(state, {
        favoriteLibrary: {
          libraryId: initialState.favoriteLibrary.libraryId
        }
      });
    }

    case types.CHECK_IF_DISPLAYNAME_IS_TAKEN: {
      return (
        action.displayname !== state.displayName ?
          assignToEmpty(state, {displayNameExists: action.exists}) :
          assignToEmpty(state, {displayNameExists: false})
      );
    }

    case types.CHANGE_PROFILE_IMAGE: {
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
    }

    case types.PROFILE_EDIT_SUBMIT_STATE_CHANGE: {
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitState: action.state
        })
      });
    }

    case types.PROFILE_EDIT_UPLOAD_PROGRESS: {
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitProgress: action.progress
        })
      });
    }

    case types.PROFILE_EDIT_SUBMIT: {
      return assignToEmpty(state, {
        birthday: action.birthday,
        description: action.description,
        displayname: action.displayname,
        email: action.email,
        errors: action.errors || [],
        fullName: action.fullName,
        phone: action.phone,
        favoriteLibrary: assignToEmpty(state.favoriteLibrary, {
          libraryId: action.libraryId,
          loanerId: action.loanerId,
          pincode: action.pincode
        })
      });
    }

    case types.GET_USER_REVIEWS: {
      return assignToEmpty(state, {
        reviews: assignToEmpty(state.reviews, {
          pending: false,
          data: state.reviews.data.concat(action.reviews.data),
          errors: state.reviews.errors.concat(action.reviews.errors)
        })
      });
    }

    case types.GET_USER_REVIEWS_PENDING: {
      return assignToEmpty(state, {
        reviews: assignToEmpty(state.reviews, {
          pending: true
        })
      });
    }

    case types.MARK_USER_MESSAGE_AS_READ: {
      let newState = assignToEmpty(state, {});
      if (newState.userMessages && newState.userMessages.unreadMessages) {
        newState.userMessages.unreadMessages -= 1;
      }
      return newState;
    }

    case types.DELETE_USER_MESSAGE: {
      const messages = [];

      state.userMessages.messages.forEach(message => {
        if (message.messageType !== action.messageType || message.createdEpoch !== action.createdEpoch) {
          messages.push(message);
        }
      });
      return assignToEmpty(state, {
        userMessages: assignToEmpty(state.userMessages, {
          messages: messages
        })
      });
    }
    case types.DELETE_PROFILE: {
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          isDeleting: true
        })
      });
    }
    case types.DELETE_PROFILE_COMPLETED: {
      console.log(action);
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          isDeleting: false,
          isDeleted: action.data.count === 1,
          hasDeleteError: action.data.count !== 1 || (action.data.error ? true : false)
        })
      });
    }

    default: {
      return state;
    }
  }
}
