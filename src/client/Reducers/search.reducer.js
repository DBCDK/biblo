/**
 * @file: Search reducer
 */

import assignToEmpty from '../Utils/assign';
import * as types from '../Constants/action.constants';

let initialState = {
  isSearchBoxVisible: false,
  groupSearchResults: [],
  groupSearchResultsPending: true,
  materialSearchResults: [],
  materialSearchResultsPending: true,
  workSuggestions: {},
  workSuggestionsPending: false,
  selectedWorkSuggestion: -1,
  initialQuery: '',
  query: '',
  isLoadingResults: false,
  filters: {
    materialFilters: {
      book: {enabled: false, cqlFilter: 'term.worktype="literature"'},
      game: {enabled: false, cqlFilter: 'term.worktype="game"'},
      movie: {enabled: false, cqlFilter: 'term.worktype="movie"'},
      music: {enabled: false, cqlFilter: 'term.worktype="music"'},
      audiobook: {enabled: false, cqlFilter: '(term.type="lydbog" and term.worktype="literature")'}
    }
  }
};

let jsonData = document.getElementById('JSONDATA');

if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
  let data = JSON.parse(jsonData.innerHTML);
  if (data.query) {
    // set initial query that was delivered with the HTTP response
    initialState.initialQuery = initialState.query = data.query;




    initialState.isSearchBoxVisible = true;
  }

  if (data.materialSearchResults) {
    initialState.materialSearchResults = data.materialSearchResults;
    initialState.materialSearchResultsPending = false;
  }
}


export default function searchReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.TOGGLE_SEARCH_BOX: {
      return assignToEmpty(state, {isSearchBoxVisible: !state.isSearchBoxVisible});
    }

    case types.SUGGESTIONS_ARE_LOADING: {
      return assignToEmpty(state, {workSuggestionsPending: true});
    }

    case types.GOT_OPENPLATFORM_SUGGESTIONS: {
      let newState = assignToEmpty(state, {});
      newState.workSuggestions[action.res.q] = action.res.data;
      return newState;
    }

    case types.LOAD_MORE_RESULTS: {
      return assignToEmpty(state, {isLoadingResults: true});
    }

    case types.LOADED_MORE_RESULTS: {
      return assignToEmpty(state, {materialSearchResults: action.results, isLoadingResults: false});
    }

    case types.SELECT_NEXT_SUGGESTED_WORK_ELEMENT: {
      if (state.workSuggestions[state.query].length > 0) {
        // Eslint is wrong about this line.
        let newState = assignToEmpty(state, {}); // eslint-disable-line no-shadow

        if (newState.selectedWorkSuggestion >= 0) {
          newState.workSuggestions[newState.query][newState.selectedWorkSuggestion].active = false;
        }

        if (newState.selectedWorkSuggestion < (newState.workSuggestions[newState.query].length - 1)) {
          newState.selectedWorkSuggestion += 1;
        }
        else {
          newState.selectedWorkSuggestion = 0;
        }

        newState.workSuggestions[newState.query][newState.selectedWorkSuggestion].active = true;

        return newState;
      }

      return state;
    }

    case types.SELECT_PREVIOUS_SUGGESTED_WORK_ELEMENT: {
      if (state.query && state.query.length > 0 && state.workSuggestions[state.query].length > 0) {
        // This one too.
        let newState = assignToEmpty(state, {}); // eslint-disable-line no-shadow

        if (newState.selectedWorkSuggestion >= 0) {
          newState.workSuggestions[newState.query][newState.selectedWorkSuggestion].active = false;
        }

        if (newState.selectedWorkSuggestion > 0) {
          newState.selectedWorkSuggestion -= 1;
        }
        else {
          newState.selectedWorkSuggestion = newState.workSuggestions[newState.query].length - 1;
        }

        newState.workSuggestions[newState.query][newState.selectedWorkSuggestion].active = true;

        return newState;
      }

      return state;
    }

    case types.SEARCH_QUERY_HAS_CHANGED: {
      return assignToEmpty(state, {query: action.q});
    }

    case types.SEARCH_TOGGLE_MATERIAL_FILTER: {
      let filtersToggledState = assignToEmpty(state, {});
      const isEnabled = filtersToggledState.filters.materialFilters[action.materialType].enabled;
      filtersToggledState.filters.materialFilters[action.materialType].enabled = !isEnabled;
      return filtersToggledState;
    }

    default: {
      return state;
    }
  }
}
