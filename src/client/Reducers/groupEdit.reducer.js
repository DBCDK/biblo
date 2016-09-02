/**
 * @file: Group reducer
 */

import assignToEmpty from '../Utils/assign';
import parseJsonData from '../Utils/parseJsonData';
import * as types from '../Constants/action.constants';

let initialState = {
  name: '',
  description: '',
  imageFile: null,
  UI: {
    imageSrc: '/no_group_image.png',
    submitState: null,
    submitProgress: 0
  },
  errors: [],
  deleted: {}
};

initialState = assignToEmpty(initialState, parseJsonData('JSONDATA', 'groupData'));

if (initialState.image) {
  initialState.UI.imageSrc = initialState.image;
}

export default function groupEditReducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case types.CHANGE_GROUP_IMAGE:
      return assignToEmpty(state, {
        imageFile: action.imageFile,
        UI: assignToEmpty(state.UI, {
          imageSrc: action.imageSrc
        })
      });

    case types.SUBMIT_EDIT_GROUP:
      return assignToEmpty(state, {
        name: action.groupName,
        description: action.groupDescription,
        imageFile: action.groupImage,
        errors: action.errors
      });

    case types.GROUP_FORM_HAS_SUBMITTED:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitState: null
        })
      });

    case types.GROUP_FORM_IS_SUBMITTING:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitState: 'SUBMITTING'
        })
      });

    case types.GROUP_FORM_UPLOAD_COMPLETED:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitState: 'UPLOAD_COMPLETE'
        })
      });

    case types.GROUP_FORM_UPLOAD_FAILED:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitState: 'UPLOAD_FAILED'
        })
      });

    case types.GROUP_FORM_UPLOAD_CANCELED:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitState: 'UPLOAD_CANCELED'
        })
      });

    case types.GROUP_FORM_UPLOAD_PROGRESS:
      return assignToEmpty(state, {
        UI: assignToEmpty(state.UI, {
          submitProgress: action.progress
        })
      });

    case types.GROUP_DELETED:
      return assignToEmpty(state, {
        deleted: {
          success: action.response.markedAsDeleted && true || false,
          error: action.response.error && true || false,
          inProgress: false
        }
      });

    default:
      return state;
  }
}
