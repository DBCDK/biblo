'use strict';

/**
 * @file: Group reducer
 */

import assignToEmpty from '../Utils/assign';
import {CHANGE_GROUP_IMAGE, SUBMIT_CREATE_GROUP, CHANGE_GROUP_COLOUR} from '../Constants/action.constants';

const initialState = {
  name: '',
  description: '',
  colour: '',
  imageFile: null,
  UI: {
    imageSrc: 'https://pbs.twimg.com/profile_images/269279233/llama270977_smiling_llama_400x400.jpg'
  }
};

export default function groupCreateReducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case CHANGE_GROUP_IMAGE:
      return assignToEmpty(state, {
        imageFile: action.imageFile,
        UI: assignToEmpty(state.UI, {
          imageSrc: action.imageSrc
        })
      });

    case SUBMIT_CREATE_GROUP:
      return assignToEmpty(state, {
        name: action.groupName,
        description: action.groupDescription,
        colour: action.groupColour,
        imageFile: action.groupImage
      });

    case CHANGE_GROUP_COLOUR:
      return assignToEmpty(state, {
        colour: action.colour
      });

    default:
      return state;
  }
}
