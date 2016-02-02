'use strict';

/**
 * @file: Group actions
 */
/* eslint-disable no-use-before-define */

import {CHANGE_GROUP_IMAGE, SUBMIT_CREATE_GROUP, CHANGE_GROUP_COLOUR} from '../Constants/action.constants';

export function asyncChangeImage(file) {
  return (dispatch) => {
    if ('FileReader' in window) {
      let reader = new FileReader();
      reader.onload = (e) => {
        dispatch(changeImage(file, e.target.result));
      };

      reader.readAsDataURL(file);
    }
    else {
      dispatch(changeImage(file, 'http://rubycycling.dk/wp-content/uploads/2016/01/Billede-kommer-snart_02.jpg'));
    }
  };
}

export function changeImage(file, src) {
  return {
    type: CHANGE_GROUP_IMAGE,
    imageSrc: src,
    imageFile: file
  };
}

export function changeGroupColour(colourEvent) {
  return {
    type: CHANGE_GROUP_COLOUR,
    colour: colourEvent.target.value
  };
}

export function asyncSubmitGroupCreateForm(imageFile, name, description, colour) {
  return (dispatch) => {
    let formData = new FormData();
    formData.append('group-name', name);
    formData.append('group-description', description);
    formData.append('group-colour-picker_colour', colour);

    if (imageFile) {
      formData.append('group_image', imageFile);
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
        dispatch(submitGroupCreateForm(imageFile, name, description, colour, data.status));
      }
      else if (e.target.readyState === 4) {
        const data = JSON.parse(e.target.response);
        dispatch(submitGroupCreateForm(imageFile, name, description, colour, data.status));
      }
    };
    request.send(formData);
  };
}

function submitGroupCreateForm(imageFile, name, description, colour, status) {
  return {
    type: SUBMIT_CREATE_GROUP,
    groupImage: imageFile,
    groupName: name,
    groupDescription: description,
    groupColour: colour,
    status
  };
}
