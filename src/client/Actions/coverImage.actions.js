/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';

const getCoverImageSocket = SocketClient('coverImage');

export function asyncGetCoverImage(pid, worktype) {
  return dispatch => { // eslint-disable-line no-unused-vars
    let coverObject = {};
    coverObject[pid] = `/images/covers/${worktype}.png`;
    setTimeout(() => dispatch(gotCoverImage(coverObject)));
    getCoverImageSocket.request({pid});
  };
}

export function asyncListenForCoverImages() {
  return dispatch => {
    getCoverImageSocket.response(res => dispatch(gotCoverImage(res)));
  };
}

export function gotCoverImage(coverImageResult) {
  return {
    type: types.GOT_COVER_IMAGE_FROM_PID,
    coverImageResult
  };
}
