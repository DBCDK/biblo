'use strict';

/**
 * @file: Entrypoint for all reducers
 * Combines the apps reducers to set the store context for all rendered components.
 */

import {combineReducers} from 'redux';
import groupCreateReducer from './groupCreate.reducer';
import profileReducer from './profile.reducer';

const rootReducer = combineReducers({
  groupCreateReducer,
  profileReducer
});

export default rootReducer;
