'use strict';

/**
 * Constants to keep track of all the actions in the app.
 * This makes sure name clashes don't occur, so the state remains predictable.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'YOUR_ACTION_CONSTANT';
 */

// Actions for profileReducer
export const CHANGE_PROFILE_USERNAME = 'CHANGE_PROFILE_USERNAME';
export const CHANGE_PROFILE_AGE = 'CHANGE_PROFILE_AGE';

// Profile Actions
export const GET_USER_PROFILE = 'GET_USER_PROFILE';

// Group Actions
export const CHANGE_GROUP_IMAGE = 'CHANGE_GROUP_IMAGE';
export const CHANGE_GROUP_COLOUR = 'CHANGE_GROUP_COLOUR';
export const SUBMIT_CREATE_GROUP = 'SUBMIT_CREATE_GROUP';
export const GET_GROUP = 'GET_GROUP';
export const GROUP_FORM_IS_SUBMITTING = 'GROUP_FORM_IS_SUBMITTING';
export const GROUP_FORM_UPLOAD_COMPLETED = 'GROUP_FORM_UPLOAD_COMPLETED';
export const GROUP_FORM_UPLOAD_FAILED = 'GROUP_FORM_UPLOAD_FAILED';
export const GROUP_FORM_UPLOAD_CANCELED = 'GROUP_FORM_UPLOAD_CANCELED';
export const GROUP_FORM_UPLOAD_PROGRESS = 'GROUP_FORM_UPLOAD_PROGRESS';
export const GROUP_FORM_HAS_SUBMITTED = 'GROUP_FORM_HAS_SUBMITTED';
export const GROUP_FOLLOW = 'GROUP_FOLLOW';

// Post Actions
export const ADD_POST = 'ADD_POST';
