/**
 * @file: Profile actions
 */
/* eslint-disable no-use-before-define */

// Types
import * as types from '../Constants/action.constants';

// Libraries
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

// Actions
import {asyncLoadMetadataForReview} from './group.actions';
import {asyncGetCoverImage} from './coverImage.actions';

// Sockets
const setUserMessageReadSocket = SocketClient('setUserMessageRead');
const deleteUserMessageSocket = SocketClient('deleteUserMessage');
const getReviewsSocket = SocketClient('getReviews');
const checkIfDisplayNameIsTaken = SocketClient('checkIfDisplayNameIsTaken');

// Listeners
const checkIfDisplayNameIsTakenListener = once(checkIfDisplayNameIsTaken.response);

export function getProfile() {
  return {
    type: types.GET_USER_PROFILE
  };
}

export function asyncCheckDisplayNameExists(displayName) {
  return (dispatch) => {
    checkIfDisplayNameIsTakenListener((res) => dispatch(checkDisplayNameExists(res.data.displayname, res.data.exists)));
    checkIfDisplayNameIsTaken.request(displayName);
  };
}

export function checkDisplayNameExists(displayname, exists) {
  return {
    type: types.CHECK_IF_DISPLAYNAME_IS_TAKEN,
    displayname,
    exists
  };
}

export function asyncProfileEditSubmit(imageFile, displayname, email, phone, libraryId, loanerId, pincode, description, birthday, fullName, options) {
  return (dispatch) => {
    dispatch(profileEditSubmitStateChange('SUBMITTING'));

    let fields = {
      displayname,
      description,
      email,
      phone,
      fullName,
      birthday,
      libraryId,
      loanerId,
      pincode
    };

    let formData = new FormData();

    for (var key in fields) {
      if (fields.hasOwnProperty(key) && fields[key] && fields[key].length > 0) {
        formData.append(key, fields[key]);
      }
    }

    if (imageFile) {
      formData.append('profile_image', imageFile);
    }

    let request = new XMLHttpRequest();
    request.open('POST', options && options.formLocation || window.location.href);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.onreadystatechange = (e) => {
      if (
        e.target.readyState === 4
      ) {
        const data = JSON.parse(e.target.response);
        if (data.redirect && !(options && options.preventRedirect)) {
          window.location.href = data.redirect;
        }
        dispatch(profileEditSubmitStateChange('SUBMITTED'));
        dispatch(profileEditSubmit(
          imageFile,
          displayname,
          email,
          phone,
          libraryId,
          loanerId,
          pincode,
          description,
          birthday,
          fullName,
          data.status,
          data.errors
        ));
      }
    };

    request.upload.addEventListener('progress', (e) => dispatch(profileEditUploadProgress(e)));
    request.upload.addEventListener('load', () => dispatch(profileEditSubmitStateChange('UPLOAD_COMPLETE')));
    request.upload.addEventListener('error', () => dispatch(profileEditSubmitStateChange('UPLOAD_FAILED')));
    request.upload.addEventListener('abort', () => dispatch(profileEditSubmitStateChange('UPLOAD_CANCELED')));
    request.send(formData);
  };
}

export function profileEditSubmit(
  imageFile,
  displayname,
  email,
  phone,
  libraryId,
  loanerId,
  pincode,
  description,
  birthday,
  fullName,
  status,
  errors
) {
  return {
    type: types.PROFILE_EDIT_SUBMIT,
    imageFile,
    displayname,
    email,
    phone,
    libraryId,
    loanerId,
    pincode,
    description,
    birthday,
    fullName,
    status,
    errors
  };
}

export function asyncChangeProfileImage(file) {
  return (dispatch) => {
    if ('FileReader' in window) {
      let reader = new FileReader();
      reader.onload = (e) => {
        dispatch(changeProfileImage(file, e.target.result));
      };

      reader.readAsDataURL(file);
    }
    else {
      dispatch(changeProfileImage(file, '/Billede-kommer-snart.jpg'));
    }
  };
}

export function changeProfileImage(file, url) {
  return {
    type: types.CHANGE_PROFILE_IMAGE,
    imageSrc: url,
    imageFile: file
  };
}

export function profileEditUploadProgress(event) {
  return {
    type: types.PROFILE_EDIT_UPLOAD_PROGRESS,
    event,
    progress: Math.floor((event.loaded / event.total) * 100)
  };
}

export function profileEditSubmitStateChange(state) {
  return {
    type: types.PROFILE_EDIT_SUBMIT_STATE_CHANGE,
    state
  };
}

/**
 * Get a persons reviews (used mostly in the pagination).
 * @param {Number} reviewownerid
 * @param {Number} skip
 * @param {Number} limit
 * @returns {function()}
 */
export function asyncGetUserReviews(reviewownerid, skip, limit = 10) {
  return dispatch => {
    dispatch(getUserReviewsPending());
    getReviewsSocket.responseOnce((reviews) => {
      reviews.data.forEach((review) => {
        asyncGetCoverImage(review.pid, review.worktype)(dispatch);
        asyncLoadMetadataForReview(review.pid)(dispatch);
      });

      dispatch(getUserReviews(reviews));
    });

    getReviewsSocket.request({where: {reviewownerid, markedAsDeleted: null}, skip, limit});
  };
}

/**
 * Signals that reviews are pending
 * @returns {{type}}
 */
export function getUserReviewsPending() {
  return {
    type: types.GET_USER_REVIEWS_PENDING
  };
}

/**
 *
 * @param {Object} reviews
 * @returns {{type, reviews: {Object}}}
 */
export function getUserReviews(reviews) {
  return {
    type: types.GET_USER_REVIEWS,
    reviews
  };
}

/**
 *
 * @param {String} messageType - Type of message (for example "type-orderIsReady").
 * @param {Number} createdEpoch - Epoch of when the message was created (Find this is the message object).
 * @returns {function()} - Dispatches the result once it arrives.
 */
export function asyncMarkUserMessageAsRead({messageType, createdEpoch}) {
  return (dispatch) => {
    setUserMessageReadSocket.responseOnce((resp) => dispatch(markUserMessageAsRead(resp.message)));
    setUserMessageReadSocket.request({messageType, createdEpoch});
  };
}

/**
 * Used internally to pass a response to a reducer.
 * @param messageType
 * @param createdEpoch
 */
export function markUserMessageAsRead({messageType, createdEpoch}) {
  return {
    type: types.MARK_USER_MESSAGE_AS_READ,
    messageType,
    createdEpoch
  };
}

/**
 *
 * @param {String} messageType - Type of message (for example "type-orderIsReady").
 * @param {Number} createdEpoch - Epoch of when the message was created (Find this is the message object).
 * @returns {function()} - Dispatches the result once it arrives.
 */
export function asyncDeleteUserMessage({messageType, createdEpoch}) {
  return (dispatch) => {
    deleteUserMessageSocket.responseOnce((resp) => dispatch(deleteUserMessage(resp.message)));
    deleteUserMessageSocket.request({messageType, createdEpoch});
  };
}

/**
 * Used internally to pass a response to a reducer.
 * @param messageType
 * @param createdEpoch
 */
export function deleteUserMessage({messageType, createdEpoch}) {
  return {
    type: types.DELETE_USER_MESSAGE,
    messageType,
    createdEpoch
  };
}
