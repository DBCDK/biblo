/**
 * Constants to keep track of all the actions in the app.
 * This makes sure name clashes don't occur, so the state remains predictable.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'YOUR_ACTION_CONSTANT';
 */


// Actions that go across reducers
export const callServiceProvider = 'callServiceProvider';

// Actions for high-level UI functionality
export const OPEN_MODAL_WINDOW = 'OPEN_MODAL_WINDOW';
export const CLOSE_MODAL_WINDOW = 'CLOSE_MODAL_WINDOW';

// Agency Actions
export const GET_LIBRARY_DETAILS = 'GET_LIBRARY_DETAILS';

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
export const GET_USER_REVIEWS = 'GET_USER_REVIEWS';
export const GET_USER_REVIEWS_PENDING = 'GET_USER_REVIEWS_PENDING';

// Group Actions
export const CHANGE_GROUP_IMAGE = 'CHANGE_GROUP_IMAGE';
export const SUBMIT_CREATE_GROUP = 'SUBMIT_CREATE_GROUP';
export const SUBMIT_EDIT_GROUP = 'SUBMIT_EDIT_GROUP';
export const GET_GROUP = 'GET_GROUP';
export const GET_SINGLE_COMMENT = 'GET_SINGLE_COMMENT';
export const LIST_GROUPS = 'LIST_GROUPS';
export const NEW_GROUPS_LIST_IS_LOADING = 'NEW_GROUPS_LIST_IS_LOADING';
export const POPULAR_GROUPS_IS_LOADING = 'POPULAR_GROUPS_IS_LOADING';
export const GROUP_FORM_IS_SUBMITTING = 'GROUP_FORM_IS_SUBMITTING';
export const GROUP_FORM_UPLOAD_COMPLETED = 'GROUP_FORM_UPLOAD_COMPLETED';
export const GROUP_FORM_UPLOAD_FAILED = 'GROUP_FORM_UPLOAD_FAILED';
export const GROUP_FORM_UPLOAD_CANCELED = 'GROUP_FORM_UPLOAD_CANCELED';
export const GROUP_FORM_UPLOAD_PROGRESS = 'GROUP_FORM_UPLOAD_PROGRESS';
export const GROUP_FORM_HAS_SUBMITTED = 'GROUP_FORM_HAS_SUBMITTED';
export const GROUP_DELETE = 'GROUP_DELETE';
export const GROUP_DELETED = 'GROUP_DELETED';
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
export const LOAD_METADATA_FOR_REVIEW_FROM_PID = 'LOAD_METADATA_FOR_REVIEW_FROM_PID';
export const GOT_UPDATED_GROUP_DATA = 'GOT_UPDATED_GROUP_DATA';
export const GOT_CHECK_IF_GROUP_NAME_EXISTS = 'checkIfGroupNameExistsResponse';

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
export const FLAG_REVIEW = 'FLAG_REVIEW';

// Like actions
export const LIKE_POST = 'LIKE_POST';
export const UNLIKE_POST = 'UNLIKE_POST';
export const LIKE_WORK_REVIEW = 'LIKE_WORK_REVIEW';
export const UNLIKE_WORK_REVIEW = 'UNLIKE_WORK_REVIEW';

// Review actions
export const CREATE_WORK_REVIEW = 'CREATE_WORK_REVIEW';
export const DELETE_WORK_REVIEW = 'DELETE_WORK_REVIEW';
export const GET_WORK_REVIEWS = 'GET_WORK_REVIEWS';
export const GET_WORK_REVIEWS_IS_LOADING = 'GET_WORK_REVIEWS_IS_LOADING';

// Search actions
export const TOGGLE_SEARCH_BOX = 'TOGGLE_SEARCH_BOX';
export const SEARCH = 'SEARCH';
export const SUGGESTIONS_ARE_LOADING = 'SUGGESTIONS_ARE_LOADING';
export const GOT_OPENPLATFORM_SUGGESTIONS = 'suggestResponse';
export const LOADED_MORE_MATERIAL_RESULTS = 'LOADED_MORE_MATERIAL_RESULTS';
export const LOAD_MORE_MATERIAL_RESULTS = 'LOAD_MORE_MATERIAL_RESULTS';
export const LOADED_MORE_GROUP_RESULTS = 'LOADED_MORE_GROUP_RESULTS';
export const LOAD_MORE_GROUP_RESULTS = 'LOAD_MORE_GROUP_RESULTS';

export const SELECT_NEXT_SUGGESTED_WORK_ELEMENT = 'SELECT_NEXT_SUGGESTED_WORK_ELEMENT';
export const SELECT_PREVIOUS_SUGGESTED_WORK_ELEMENT = 'SELECT_PREVIOUS_SUGGESTED_WORK_ELEMENT';
export const SEARCH_QUERY_HAS_CHANGED = 'SEARCH_QUERY_HAS_CHANGED';
export const SEARCH_TOGGLE_GROUP_FILTER = 'SEARCH_TOGGLE_GROUP_FILTER';
export const SEARCH_TOGGLE_MATERIAL_FILTER = 'SEARCH_TOGGLE_MATERIAL_FILTER';
export const SEARCH_RESET_MATERIAL_FILTERS = 'SEARCH_RESET_MATERIAL_FILTERS';

// UserStatus actions
export const USERSTATUS_RENEW_LOAN = 'USERSTATUS_RENEW_LOAN';
export const USERSTATUS_GET_STATUS = 'USERSTATUS_GET_STATUS';

// Work actions
export const CHECK_AVAILABILITY = 'CHECK_AVAILABILITY';
export const WORK_IS_ORDERING = 'WORK_IS_ORDERING';
export const WORK_HAS_ORDERED = 'WORK_HAS_ORDERED';
export const WORK_ORDER_RESET_STATE = 'WORK_ORDER_RESET_STATE';
export const GET_WORK_METADATA_FOR_PERSONAL_REVIEWS = 'GET_WORK_METADATA_FOR_PERSONAL_REVIEWS'; // action used to retreive works associated with one ore more pids
export const GET_WORK_ONLINEACCESS = 'GET_WORK_ONLINEACCESS';
export const MARK_USER_MESSAGE_AS_READ = 'MARK_USER_MESSAGE_AS_READ';
export const DELETE_USER_MESSAGE = 'DELETE_USER_MESSAGE';


// Widget actions
export const GET_LATEST_REVIEWS_FOR_WIDGET = 'GET_LATEST_REVIEWS_FOR_WIDGET';
export const GOT_COVER_IMAGE_FROM_PID_FOR_WIDGET = 'GOT_COVER_IMAGE_FROM_PID_FOR_WIDGET';
export const GOT_BEST_RATED_WORKS = 'getTopReviewsResponse';
export const GOT_CAMPAIGN = 'getCampaignResponse';
export const GOT_CAMPAIGN_REVIEWS = 'getCampaignReviewsResponse';
export const GOT_GROUP = 'getGroupResponse';
export const GOT_POSTS = 'getPostsResponse';
export const GOT_GROUPS = 'listGroupsResponse';
export const GOT_REVIEWS = 'getReviewsResponse';
export const GOT_WORKS = 'workResponse';
export const GOT_WORKS_FROM_REVIEWS = 'getWorkFromReviewIdsResponse';

// CoverImage actions
export const GOT_COVER_IMAGE_FROM_PID = 'GOT_COVER_IMAGE_FROM_PID';
