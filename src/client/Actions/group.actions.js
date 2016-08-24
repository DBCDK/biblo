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
const markPostAsDeleted = SocketClient('deletePost');
const deleteGroup = SocketClient('deleteGroup');
const loadComments = SocketClient('getComments');
const loadMetadataForReviewAttachedToPostOrCommentSocket = SocketClient('work');
const getSinglePosts = SocketClient('getSinglePosts');
const getSingleCommentSocket = SocketClient('getSingleComment');

export function asyncChangeImage(file) {
  return (dispatch) => {
    return new Promise((resolve) => {
      if ('FileReader' in window) {
        let reader = new FileReader();
        reader.onload = (e) => {
          resolve(dispatch(changeImage(file, e.target.result)));
        };

        reader.readAsDataURL(file);
      }
      else {
        resolve(dispatch(changeImage(file, '/Billede-kommer-snart.jpg')));
      }
    });
  };
}

export function changeImage(file, src) {
  return {
    type: types.CHANGE_GROUP_IMAGE,
    imageSrc: src,
    imageFile: file
  };
}

export function showGroups(response, skip, limit, groupType) {
  return {
    type: types.LIST_GROUPS,
    groups: response,
    skip: skip,
    limit: limit,
    groupType
  };
}

export function moreGroupsLoading(type = 'new') {
  return {
    type: type === 'new' ? types.NEW_GROUPS_LIST_IS_LOADING : types.POPULAR_GROUPS_IS_LOADING
  };
}

export function asyncShowGroups(type, skip, limit) {
  return function(dispatch) {
    dispatch(moreGroupsLoading(type));
    let listgroup_params = {
      skip,
      limit
    };
    if (type !== 'new') {
      listgroup_params.order = 'group_pop DESC';
    }

    listGroups.request(listgroup_params);
    const event = listGroups.response(response => {
      dispatch(showGroups(response, skip, limit, type));
      event.off();
    });
  };
}

export function changeGroupColour(colourEvent) {
  return {
    type: types.CHANGE_GROUP_COLOUR,
    colour: colourEvent.target.value
  };
}

/**
 * Asynchronously requests a full comment object based on its ID.
 *
 * @param {string} commentId
 * @return {function(*)}
 */
export function asyncGetSingleComment(commentId) {
  return (dispatch) => {
    getSingleCommentSocket.responseOnce((response) => {
      dispatch(getSingleComment(response));
    });
    getSingleCommentSocket.request({id: commentId});
  };
}

/**
 * Callback method for asyncGetSingleComment that dispatches the
 * GET_SINGLE_COMMENT action.
 *
 * @param {Object} comment
 * @return {{type, comment: {Object}}}
 */
export function getSingleComment(comment) {
  return {
    type: types.GET_SINGLE_COMMENT,
    comment: comment
  };
}

export function asyncSubmitGroupCreateForm(imageFile, name, description) {
  return (dispatch) => {
    return new Promise((resolve) => {
      dispatch(groupFormIsSubmitting());

      let formData = new FormData();
      formData.append('group-name', name);
      formData.append('group-description', description);

      if (imageFile) {
        formData.append('group_image', imageFile);
      }

      let request = new XMLHttpRequest();
      request.open('POST', window.location.href);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      request.onreadystatechange = (e) => {
        if (e.target.readyState === 4) {
          const data = JSON.parse(e.target.response);
          if (data.redirect) {
            window.location.href = data.redirect;
          }
          dispatch(groupFormHasSubmitted());
          resolve(dispatch(submitGroupCreateForm(imageFile, name, description, data.status, data.errors)));
        }
      };
      request.upload.addEventListener('progress', (e) => dispatch(groupFormUploadProgress(e)));
      request.upload.addEventListener('load', (e) => dispatch(groupFormUploadCompleted(e)));
      request.upload.addEventListener('error', (e) => dispatch(groupFormUploadFailed(e)));
      request.upload.addEventListener('abort', (e) => dispatch(groupFormUploadCanceled(e)));
      request.send(formData);
    });
  };
}

function submitGroupCreateForm(imageFile, name, description, status, errors = []) {
  return {
    type: types.SUBMIT_CREATE_GROUP,
    groupImage: imageFile,
    groupName: name,
    groupDescription: description,
    status,
    errors
  };
}

export function asyncSubmitGroupEditForm(imageFile, name, description) {
  return (dispatch) => {
    dispatch(groupFormIsSubmitting());

    let formData = new FormData();
    formData.append('group-name', name);
    formData.append('group-description', description);

    if (imageFile) {
      formData.append('group_image', imageFile);
    }

    let request = new XMLHttpRequest();
    request.open('POST', window.location.href);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.onreadystatechange = (e) => {
      if (e.target.readyState === 4) {
        const data = JSON.parse(e.target.response);
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        dispatch(groupFormHasSubmitted());
        dispatch(submitGroupEditForm(imageFile, name, description, data.status, data.errors));
      }
    };
    request.upload.addEventListener('progress', (e) => dispatch(groupFormUploadProgress(e)));
    request.upload.addEventListener('load', (e) => dispatch(groupFormUploadCompleted(e)));
    request.upload.addEventListener('error', (e) => dispatch(groupFormUploadFailed(e)));
    request.upload.addEventListener('abort', (e) => dispatch(groupFormUploadCanceled(e)));
    request.send(formData);
  };
}

function submitGroupEditForm(imageFile, name, description, status, errors = []) {
  return {
    type: types.SUBMIT_EDIT_GROUP,
    groupImage: imageFile,
    groupName: name,
    groupDescription: description,
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

export function asyncGroupDelete(id) {
  return function(dispatch) {
    dispatch(groupDelete());
    deleteGroup.request({
      id
    });
    const event = deleteGroup.response(response => {
      dispatch(groupDeleted(response));
      event.off();
    });
  };
}

export function groupDelete() {
  return {
    type: types.GROUP_DELETE
  };
}

export function groupDeleted(response) {
  return {
    type: types.GROUP_DELETED,
    response
  };
}


export function asyncGroupFollow(enableFollow, groupId, profileId) {
  return function(dispatch) {
    dispatch(groupFollow(enableFollow));

    if (enableFollow) {
      joinGroup.request({
        groupId,
        profileId
      });
    }
    else {

      leaveGroup.request({
        groupId,
        profileId
      });
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
      getGroup.request({
        id: groupId,
        allMembers: true
      });
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
  return function(dispatch) {
    loadPosts.request({
      id,
      skip,
      limit
    });
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

export function addPost(post) {
  return {
    type: types.GROUP_ADD_POST,
    post
  };
}

export function editPost(post) {
  return {
    type: types.GROUP_EDIT_POST,
    post
  };
}

export function addComment(comment) {
  return {
    type: types.GROUP_ADD_COMMENT,
    comment
  };
}

export function editComment(comment) {
  return {
    type: types.GROUP_EDIT_COMMENT,
    comment
  };
}

export function asyncShowMoreComments(id, skip, limit) {
  return function(dispatch) {
    dispatch(moreCommentsLoading(id));
    loadComments.request({
      id,
      skip,
      limit
    });
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

export function asyncDeletePost(postId) {
  return function(dispatch) {
    dispatch(deletePost(postId));
    markPostAsDeleted.request({id: postId});
  };
}

export function deletePost(postId) {
  return {
    type: types.DELETE_POST,
    postId: postId
  };
}

export function asyncLoadMetadataForReview(pid) {
  return dispatch => {
    loadMetadataForReviewAttachedToPostOrCommentSocket.responseOnce((res) => dispatch(loadMetadataForReview(res)));
    loadMetadataForReviewAttachedToPostOrCommentSocket.request({
      pids: [pid],
      fields: [
        'dcTitleFull',
        'collection',
        'creator',
        'dcCreator',
        'contributorAct',
        'contributor'
      ]
    });
  };
}

export function loadMetadataForReview(work) {
  return {
    type: types.LOAD_METADATA_FOR_REVIEW_FROM_PID,
    work
  };
}

export function asyncListenToGroupForNewContent(groupId) {
  return dispatch => {
    // Listen for the full comment objects
    getSingleCommentSocket.response(commentResponse => {
      dispatch(groupContentWasUpdated({comment: commentResponse}));
    });

    // Listen for the full post objects
    getSinglePosts.response(postResponse => {
      dispatch(groupContentWasUpdated({post: postResponse}));
    });

    getGroup.subscribe(`new_group_content-${groupId}`, data => {
      let gData = data && data.data && data.data.data;
      if (gData.commentownerid && gData.id) {
        getSingleCommentSocket.request({id: gData.id});
      }
      else if (gData.postownerid && gData.id) {
        getSinglePosts.request({id: gData.id});
      }
    });
  };
}

export function groupContentWasUpdated({comment, post}) {
  return {
    type: types.GOT_UPDATED_GROUP_DATA,
    comment,
    post
  };
}

export function callServiceProvider(event, data) {
  return {
    type: types.callServiceProvider,
    event,
    data
  };
}
