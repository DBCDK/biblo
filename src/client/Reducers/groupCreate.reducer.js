/**
 * @file: Group reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const initialState = {
  name: '',
  description: '',
  imageFile: null,
  UI: {
    imageSrc: '/no_group_image.png',
    submitState: null,
    submitProgress: 0
  },
  checkedNames: {},
  errors: []
};

export default function groupCreateReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.CHANGE_GROUP_IMAGE:
      return assignToEmpty(state, {
        imageFile: action.imageFile,
        UI: assignToEmpty(state.UI, {
          imageSrc: action.imageSrc
        }),
        errors: []
      });

    case types.SUBMIT_CREATE_GROUP:
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

    case types.GOT_CHECK_IF_GROUP_NAME_EXISTS: {
      const checkedNames = {};
      const checkName = action.data;

      if (checkName.groupName) {
        checkedNames[checkName.groupName] = checkName.exists;
      }

      return assignToEmpty(state, {
        checkedNames: assignToEmpty(state.checkedNames, checkedNames)
      });
    }

    default:
      return state;
  }
}
