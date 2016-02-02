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

// Group Actions
export const SAVE_GROUP = 'SAVE_GROUP';
export const CHANGE_GROUP_IMAGE = 'CHANGE_GROUP_IMAGE';
export const CHANGE_GROUP_COLOUR = 'CHANGE_GROUP_COLOUR';
export const SUBMIT_CREATE_GROUP = 'SUBMIT_CREATE_GROUP';
