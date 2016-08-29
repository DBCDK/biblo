/**
 * @file: Entrypoint for all reducers
 * Combines the apps reducers to set the store context for all rendered components.
 */

import {combineReducers} from 'redux';
import agencyReducer from './agency.reducer';
import uiReducer from './ui.reducer';
import searchReducer from './search.reducer';
import groupCreateReducer from './groupCreate.reducer';
import groupEditReducer from './groupEdit.reducer';
import groupViewReducer from './groupView.reducer';
import profileReducer from './profile.reducer';
import profileFeedReducer from './profileFeed.reducer';
import entitySuggestReducer from './entitySuggestLibrary.reducer';
import listGroupsReducer from './listGroups.reducer';
import reviewReducer from './review.reducer';
import widgetReducer from './widget.reducer';
import workReducer from './work.reducer';
import coverImageReducer from './coverImages.reducer';
import globalReducer from './globalContent.reducer';

const rootReducer = combineReducers({
  agencyReducer,
  uiReducer,
  searchReducer,
  groupCreateReducer,
  groupViewReducer,
  groupEditReducer,
  profileReducer,
  profileFeedReducer,
  entitySuggestReducer,
  listGroupsReducer,
  reviewReducer,
  widgetReducer,
  coverImageReducer,
  workReducer,
  globalReducer
});

export default rootReducer;
