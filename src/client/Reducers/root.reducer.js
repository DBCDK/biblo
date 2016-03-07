'use strict';

/**
 * @file: Entrypoint for all reducers
 * Combines the apps reducers to set the store context for all rendered components.
 */

import {combineReducers} from 'redux';
import uiReducer from './ui.reducer';
import groupCreateReducer from './groupCreate.reducer';
import groupViewReducer from './groupView.reducer';
import profileReducer from './profile.reducer';
import profileFeedReducer from './profileFeed.reducer';
import entitySuggestReducer from './entitySuggestLibrary.reducer';

const rootReducer = combineReducers({
  uiReducer,
  groupCreateReducer,
  groupViewReducer,
  profileReducer,
  profileFeedReducer,
  entitySuggestReducer
});

export default rootReducer;
