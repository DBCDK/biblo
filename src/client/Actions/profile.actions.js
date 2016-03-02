'use strict';

/**
 * @file: Profile actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const checkIfDisplayNameIsTaken = SocketClient('checkIfDisplayNameIsTaken');
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

export function asyncProfileEditSubmit(imageFile, displayname, email, phone, libraryId, loanerId, pincode, description, birthday, fullName) {
  return function(dispatch) {
    dispatch(profileEditSubmitStateChange('SUBMITTING'));

    let formData = new FormData();
    formData.append('displayname', displayname);
    formData.append('description', description);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('fullName', fullName);
    formData.append('birthday', birthday);
    formData.append('libraryId', libraryId);
    formData.append('loanerId', loanerId);
    formData.append('pincode', pincode);

    if (imageFile) {
      formData.append('profile_image', imageFile);
    }

    let request = new XMLHttpRequest();
    request.open('POST', window.location.href);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.onreadystatechange = (e) => {
      if (
        e.target.readyState === 4 &&
        e.target.status !== 404 &&
        e.target.status !== 500 &&
        e.target.status !== 403
      ) {
        const data = JSON.parse(e.target.response);
        if (data.redirect) {
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
      else if (e.target.readyState === 4) {
        const data = JSON.parse(e.target.response);
        if (data.redirect) {
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
    progress: Math.floor((event.loaded/event.total)*100)
  };
}

export function profileEditSubmitStateChange(state) {
  return {
    type: types.PROFILE_EDIT_SUBMIT_STATE_CHANGE,
    state
  };
}
