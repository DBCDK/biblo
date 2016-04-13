/**
 * @file: Entrypoint for all reducers
 * Combines the apps reducers to set the store context for all rendered components.
 */

import {combineReducers} from 'redux';
import uiReducer from './ui.reducer';
import groupCreateReducer from './groupCreate.reducer';
import groupEditReducer from './groupEdit.reducer';
import groupViewReducer from './groupView.reducer';
import profileReducer from './profile.reducer';
import profileFeedReducer from './profileFeed.reducer';
import entitySuggestReducer from './entitySuggestLibrary.reducer';
import listGroupsReducer from './listGroups.reducer';
import reviewReducer from './review.reducer';

const rootReducer = combineReducers({
  uiReducer,
  groupCreateReducer,
  groupViewReducer,
  groupEditReducer,
  profileReducer,
  profileFeedReducer,
  entitySuggestReducer,
  listGroupsReducer,
  reviewReducer
});

export default rootReducer;
