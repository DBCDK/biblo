'use strict';

/**
 * @file: Group actions
 */
/* eslint-disable no-use-before-define */

import * as types from '../Constants/action.constants';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {once} from 'lodash';

const joinGroup = SocketClient('joinGroup');
const getGroup = SocketClient('getGroup');
const listGroups = SocketClient('listGroups');
const leaveGroup = SocketClient('leaveGroup');
const getGroupListener = once(getGroup.response);
const loadPosts = SocketClient('getPosts');
const loadComments = SocketClient('getComments');

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
      dispatch(changeImage(file, '/Billede-kommer-snart.jpg'));
    }
  };
}

export function changeImage(file, src) {
  return {
    type: types.CHANGE_GROUP_IMAGE,
    imageSrc: src,
    imageFile: file
  };
}

export function showMoreGroups(response, skip, limit) {
  return {
    type: types.LIST_GROUPS,
    groupData: response,
    skip: skip,
    limit: limit
  };
}

export function asyncShowGroups(skip, limit) {
  return function (dispatch) {
    listGroups.request({skip, limit});
    const event = listGroups.response(response => {
      dispatch(showMoreGroups(response, skip, limit));
      event.off();
    })
  };
}

export function asyncShowMoreComments(id, skip, limit) {
  return function (dispatch) {
    dispatch(moreCommentsLoading(id));
    loadComments.request({id, skip, limit});
    const event = loadComments.response(response => {
      dispatch(showMoreComments(id, response, skip + limit));
      event.off();
    });
  };
}


export function moreCommentsLoading(postId) {
  return {
    type: types.GROUP_LOADING_MORE_COMMENTS,
    postId
  };
}

export function changeGroupColour(colourEvent) {
  return {
    type: types.CHANGE_GROUP_COLOUR,
    colour: colourEvent.target.value
  };
}

export function asyncSubmitGroupCreateForm(imageFile, name, description, colour) {
  return (dispatch) => {
    dispatch(groupFormIsSubmitting());

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
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        dispatch(groupFormHasSubmitted());
        dispatch(submitGroupCreateForm(imageFile, name, description, colour, data.status, data.errors));
      }
      else if (e.target.readyState === 4) {
        const data = JSON.parse(e.target.response);
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        dispatch(groupFormHasSubmitted());
        dispatch(submitGroupCreateForm(imageFile, name, description, colour, data.status, data.errors));
      }
    };
    request.upload.addEventListener('progress', (e) => dispatch(groupFormUploadProgress(e)));
    request.upload.addEventListener('load', (e) => dispatch(groupFormUploadCompleted(e)));
    request.upload.addEventListener('error', (e) => dispatch(groupFormUploadFailed(e)));
    request.upload.addEventListener('abort', (e) => dispatch(groupFormUploadCanceled(e)));
    request.send(formData);
  };
}

function submitGroupCreateForm(imageFile, name, description, colour, status, errors = []) {
  return {
    type: types.SUBMIT_CREATE_GROUP,
    groupImage: imageFile,
    groupName: name,
    groupDescription: description,
    groupColour: colour,
    status,
    errors
  };
}

export function groupFormHasSubmitted() {
  return {
    type: types.GROUP_FORM_HAS_SUBMITTED
  };
}

export function groupFormIsSubmitting() {
  return {
    type: types.GROUP_FORM_IS_SUBMITTING
  };
}

export function groupFormUploadCompleted(e) {
  return {
    type: types.GROUP_FORM_UPLOAD_COMPLETED,
    event: e
  };
}

export function groupFormUploadFailed(e) {
  return {
    type: types.GROUP_FORM_UPLOAD_FAILED,
    event: e
  };
}

export function groupFormUploadCanceled(e) {
  return {
    type: types.GROUP_FORM_UPLOAD_CANCELED,
    event: e
  };
}

export function groupFormUploadProgress(e) {
  return {
    type: types.GROUP_FORM_UPLOAD_PROGRESS,
    event: e,
    progress: Math.floor((e.loaded / e.total) * 100)
  };
}

export function asyncGroupFollow(enableFollow, groupId, profileId) {
  return function (dispatch) {
    dispatch(groupFollow(enableFollow));

    if (enableFollow) {
      joinGroup.request({groupId, profileId});
    }
    else {
      leaveGroup.request({groupId, profileId});
    }
  };
}

export function groupFollow(enableFollow) {
  return {
    type: types.GROUP_FOLLOW,
    enableFollow: enableFollow
  };
}

export function asyncGroupMembersExpand(expand, groupId) {
  if (expand) {
    return (dispatch) => {

      // handle getGroup responses
      getGroupListener((res) => {
        dispatch(groupMembersExpand(expand, res.members));
      });

      // signal that members are loading
      dispatch(groupMembersLoading());

      // send request for more group members
      getGroup.request({id: groupId, allMembers: true});
    };
  }

  return (dispatch) => {
    dispatch(groupMembersExpand(expand));
  };

}

export function groupMembersExpand(expand, members = null) {
  return {
    type: types.GROUP_MEMBERS_EXPAND,
    expand: expand,
    members: members
  };
}

export function groupMembersLoading() {
  return {
    type: types.GROUP_MEMBERS_LOADING
  };
}

export function asyncShowMorePosts(id, skip, limit) {
  return function (dispatch) {
    loadPosts.request({id, skip, limit});
    const event = loadPosts.response(response => {
      dispatch(showMorePosts(response, skip + limit));
      event.off();
    });
  };
}
export function showMorePosts(posts, numberOfPostsLoaded) {
  return {
    type: types.GROUP_SHOW_MORE_POSTS,
    posts,
    numberOfPostsLoaded
  };
}

export function asyncShowMoreComments(id, skip, limit) {
  return function (dispatch) {
    dispatch(moreCommentsLoading(id));
    loadComments.request({id, skip, limit});
    const event = loadComments.response(response => {
      dispatch(showMoreComments(id, response, skip + limit));
      event.off();
    });
  };
}

export function moreCommentsLoading(postId) {
  return {
    type: types.GROUP_LOADING_MORE_COMMENTS,
    postId
  };
}

export function showMoreComments(id, comments, numberOfCommentsLoaded) {
  return {
    type: types.GROUP_SHOW_MORE_COMMENTS,
    id,
    comments,
    numberOfCommentsLoaded
  };
}
