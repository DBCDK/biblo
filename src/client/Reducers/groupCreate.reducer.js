'use strict';

/**
 * @file: Group reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

const initialState = {
  name: '',
  description: '',
  colour: '',
  imageFile: null,
  UI: {
    imageSrc: 'https://pbs.twimg.com/profile_images/269279233/llama270977_smiling_llama_400x400.jpg',
    submitState: null,
    submitProgress: 0
  },
  errors: []
};

export default function groupCreateReducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case types.CHANGE_GROUP_IMAGE:
      return assignToEmpty(state, {
        imageFile: action.imageFile,
        UI: assignToEmpty(state.UI, {
          imageSrc: action.imageSrc
        })
      });

    case types.SUBMIT_CREATE_GROUP:
      return assignToEmpty(state, {
        name: action.groupName,
        description: action.groupDescription,
        colour: action.groupColour,
        imageFile: action.groupImage,
        errors: action.errors
      });

    case types.CHANGE_GROUP_COLOUR:
      return assignToEmpty(state, {
        colour: action.colour
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

    default:
      return state;
  }
}
