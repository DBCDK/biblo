'use strict';

/**
 * @file: Entrypoint for all reducers
 * Combines the apps reducers to set the store context for all rendered components.
 */

import {combineReducers} from 'redux';
import groupCreateReducer from './groupCreate.reducer';
import groupViewReducer from './groupView.reducer';
import profileReducer from './profile.reducer';
import profileFeedReducer from './profileFeed.reducer';
import entitySuggestReducer from './entitySuggestLibrary.reducer';
import listGroupsReducer from './listGroups.reducer';

const rootReducer = combineReducers({
  groupCreateReducer,
  groupViewReducer,
  profileReducer,
  profileFeedReducer,
  entitySuggestReducer,
  listGroupsReducer
});

export default rootReducer;
