/**
 * Constants to keep track of all the actions in the app.
 * This makes sure name clashes don't occur, so the state remains predictable.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'YOUR_ACTION_CONSTANT';
 */


// Actions for high-level UI functionality
export const OPEN_MODAL_WINDOW = 'OPEN_MODAL_WINDOW';
export const CLOSE_MODAL_WINDOW = 'CLOSE_MODAL_WINDOW';

// Actions for profileReducer
export const CHANGE_PROFILE_USERNAME = 'CHANGE_PROFILE_USERNAME';
export const CHANGE_PROFILE_AGE = 'CHANGE_PROFILE_AGE';

// Profile Actions
export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const CHECK_IF_DISPLAYNAME_IS_TAKEN = 'CHECK_IF_DISPLAYNAME_IS_TAKEN';
export const CHANGE_PROFILE_IMAGE = 'CHANGE_PROFILE_IMAGE';
export const PROFILE_EDIT_SUBMIT_STATE_CHANGE = 'PROFILE_EDIT_SUBMIT_STATE_CHANGE';
export const PROFILE_EDIT_UPLOAD_PROGRESS = 'PROFILE_EDIT_UPLOAD_PROGRESS';
export const PROFILE_EDIT_SUBMIT = 'PROFILE_EDIT_SUBMIT';

// Group Actions
export const CHANGE_GROUP_IMAGE = 'CHANGE_GROUP_IMAGE';
export const SUBMIT_CREATE_GROUP = 'SUBMIT_CREATE_GROUP';
export const SUBMIT_EDIT_GROUP = 'SUBMIT_EDIT_GROUP';
export const GET_GROUP = 'GET_GROUP';
export const LIST_GROUPS = 'LIST_GROUPS';
export const LIST_GROUPS_IS_LOADING = 'LIST_GROUPS_IS_LOADING';
export const GROUP_FORM_IS_SUBMITTING = 'GROUP_FORM_IS_SUBMITTING';
export const GROUP_FORM_UPLOAD_COMPLETED = 'GROUP_FORM_UPLOAD_COMPLETED';
export const GROUP_FORM_UPLOAD_FAILED = 'GROUP_FORM_UPLOAD_FAILED';
export const GROUP_FORM_UPLOAD_CANCELED = 'GROUP_FORM_UPLOAD_CANCELED';
export const GROUP_FORM_UPLOAD_PROGRESS = 'GROUP_FORM_UPLOAD_PROGRESS';
export const GROUP_FORM_HAS_SUBMITTED = 'GROUP_FORM_HAS_SUBMITTED';
export const GROUP_FOLLOW = 'GROUP_FOLLOW';
export const GROUP_MEMBERS_EXPAND = 'GROUP_MEMBERS_EXPAND';
export const GROUP_MEMBERS_LOADING = 'GROUP_MEMBERS_LOADING';
export const GROUP_IS_LOADING_POSTS = 'GROUP_IS_LOADING_POSTS';
export const GROUP_SHOW_MORE_POSTS = 'GROUP_SHOW_MORE_POSTS';
export const GROUP_ADD_POST = 'GROUP_ADD_POST';
export const GROUP_EDIT_POST = 'GROUP_EDIT_POST';
export const GROUP_EDIT_COMMENT = 'GROUP_EDIT_COMMENT';
export const GROUP_ADD_COMMENT = 'GROUP_ADD_COMMENT';
export const GROUP_SHOW_MORE_COMMENTS = 'GROUP_SHOW_MORE_COMMENTS';
export const GROUP_LOADING_MORE_POSTS = 'GROUP_LOADING_MORE_POSTS';
export const GROUP_LOADING_MORE_COMMENTS = 'GROUP_LOADING_MORE_COMMENTS';

// Post Actions
export const ADD_POST = 'ADD_POST';
export const DELETE_POST = 'DELETE_POST';

// Entity Suggest Actions
export const FIND_LIBRARIES = 'FIND_LIBRARIES';
export const SELECT_SUGGESTED_LIBRARY = 'SELECT_SUGGESTED_LIBRARY';
export const UNSELECT_LIBRARY = 'UNSELECT_LIBRARY';

// Feed actions
export const GET_USER_FEED = 'GET_USER_FEED';

// Flag Actions
export const FLAG_POST = 'FLAG_POST';
export const FLAG_COMMENT = 'FLAG_COMMENT';
export const FLAG_GROUP = 'FLAG_GROUP';
export const FLAG_PROFILE = 'FLAG_PROFILE';

// Like actions
export const LIKE_POST = 'LIKE_POST';
export const UNLIKE_POST = 'UNLIKE_POST';


// Review actions
export const CREATE_REVIEW = 'CREATE_REVIEW';

// Search actions
export const TOGGLE_SEARCH_BOX = 'TOGGLE_SEARCH_BOX';
