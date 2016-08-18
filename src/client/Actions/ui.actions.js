/**
 * @file: UI actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';


export function openModalWindow(modalChildren, modalTitle) {
  return {
    type: types.OPEN_MODAL_WINDOW,
    modalChildren: modalChildren,
    modalTitle: modalTitle
  };
}


export function closeModalWindow() {
  return {
    type: types.CLOSE_MODAL_WINDOW
  };
}
