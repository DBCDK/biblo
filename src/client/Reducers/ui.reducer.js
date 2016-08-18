/**
 * @file: UI reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {
  modal: {
    isOpen: false,
    children: null
  }
};

export default function uiReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.OPEN_MODAL_WINDOW:
      return assignToEmpty(state, {modal: {isOpen: true, children: action.modalChildren, title: action.modalTitle}});
    case types.CLOSE_MODAL_WINDOW:
      return assignToEmpty(state, {modal: {isOpen: false, children: null, title: null}});
    default:
      return state;
  }
}
