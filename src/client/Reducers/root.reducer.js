'use strict';

/**
 * @file: Entrypoint for all reducers
 * Combines the apps reducers to set the store context for all rendered components.
 */

import {combineReducers} from 'redux';
import groupCreateReducer from './groupCreate.reducer';
import groupViewReducer from './groupView.reducer';
import profileReducer from './profile.reducer';
import entitySuggestReducer from './entitySuggestLibrary.reducer';

const rootReducer = combineReducers({
  groupCreateReducer,
  groupViewReducer,
  profileReducer,
  entitySuggestReducer
});

export default rootReducer;
