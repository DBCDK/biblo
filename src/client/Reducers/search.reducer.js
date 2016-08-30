/**
 * @file: Search reducer
 */

import assignToEmpty from '../Utils/assign';
import parseQueryParams from '../Utils/parseQueryParams';
import * as types from '../Constants/action.constants';

let initialState = {
  isSearchBoxVisible: false,
  setFocusOnSearchBox: false,
  groupSearchResults: [],
  groupSearchResultsPending: true,
  groupSearchOffset: 0,
  groupSearchLimit: 5,
  materialSearchResults: [],
  materialSearchOffset: 0,
  materialSearchLimit: 5,
  materialSearchResultsPending: true,
  workSuggestions: {},
  workSuggestionsPending: false,
  selectedWorkSuggestion: -1,
  initialQuery: '',
  query: '',
  isLoadingMaterialResults: false,
  isLoadingGroupResults: false,
  isSearching: false,
  filters: {
    groupFilter: false,
    materialFilters: {
      book: {enabled: false},
      game: {enabled: false},
      movie: {enabled: false},
      music: {enabled: false},
      audiobook: {enabled: false}
    },
    subjectFilters: [],
    creatorFilters: []
  }
};


if (typeof window !== 'undefined') {
  // load JSONDATA payload into initial state
  let jsonData = document.getElementById('JSONDATA');

  if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
    let data = JSON.parse(jsonData.innerHTML);
    if (data.query) {
      // set initial query that was delivered with the HTTP response
      initialState.query = data.query;
      initialState.initialQuery = data.query;
      initialState.isSearchBoxVisible = true;
    }

    if (data.materialSearchResults) {
      initialState.materialSearchResults = data.materialSearchResults;
      initialState.materialSearchResultsPending = false;
    }

    if (data.groupSearchResults) {
      initialState.groupSearchResults = data.groupSearchResults;
      initialState.groupSearchResultsPending = false;
    }
  }

// identify enabled search filters by looking at the url
  const urlParams = parseQueryParams(window.location.href);

  if (urlParams.grupper) {
    initialState.filters.groupFilter = (parseInt(urlParams.grupper, 10) === 1);
  }

  if (urlParams.materialer) {
    const materialFilters = urlParams.materialer.split(',');
    for (const i in materialFilters) { // eslint-disable-line guard-for-in
      if (materialFilters[i] && initialState.filters.materialFilters[materialFilters[i]]) {
        initialState.filters.materialFilters[materialFilters[i]].enabled = true;
      }
    }
  }
  if (urlParams.emneord) {
    initialState.filters.subjectFilters = urlParams.emneord.split(',');
  }

}

export default function searchReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.TOGGLE_SEARCH_BOX: {
      return assignToEmpty(state, {
        isSearchBoxVisible: !state.isSearchBoxVisible,
        setFocusOnSearchBox: !state.isSearchBoxVisible
      });
    }

    case types.SUGGESTIONS_ARE_LOADING: {
      return assignToEmpty(state, {workSuggestionsPending: true});
    }

    case types.GOT_OPENPLATFORM_SUGGESTIONS: {
      let newState = assignToEmpty(state, {});
      const res = action.data;
      newState.workSuggestions[res.q] = res.data;
      return newState;
    }

    case types.LOAD_MORE_MATERIAL_RESULTS: {
      return assignToEmpty(state, {isLoadingMaterialResults: true, materialSearchLimit: 20});
    }

    case types.LOADED_MORE_MATERIAL_RESULTS: {
      let newOffset = state.materialSearchResults.length;
      return assignToEmpty(state, {
        materialSearchResults: state.materialSearchResults.concat(action.results),
        isLoadingMaterialResults: false,
        materialSearchOffset: newOffset
      });
    }

    case types.LOAD_MORE_GROUP_RESULTS: {
      return assignToEmpty(state, {isLoadingGroupResults: true, groupSearchLimit: 20});
    }

    case types.LOADED_MORE_GROUP_RESULTS: {
      let newOffset = state.groupSearchResults.length;
      return assignToEmpty(state, {
        groupSearchResults: state.groupSearchResults.concat(action.results),
        isLoadingGroupResults: false,
        groupSearchOffset: newOffset
      });
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

    case types.SEARCH: {
      return assignToEmpty(state, {isSearching: true});
    }

    case types.SEARCH_TOGGLE_GROUP_FILTER: {
      let filtersToggledState = assignToEmpty(state, {});
      const isEnabled = filtersToggledState.filters.groupFilter;
      filtersToggledState.filters.groupFilter = !isEnabled;
      return filtersToggledState;
    }

    case types.SEARCH_TOGGLE_MATERIAL_FILTER: {
      let filtersToggledState = assignToEmpty(state, {});
      const isEnabled = filtersToggledState.filters.materialFilters[action.materialType].enabled;
      filtersToggledState.filters.materialFilters[action.materialType].enabled = !isEnabled;
      return filtersToggledState;
    }

    case types.SEARCH_RESET_MATERIAL_FILTERS: {
      let filtersResetState = assignToEmpty(state, {});

      filtersResetState.filters.materialFilters = {
        book: {enabled: false},
        game: {enabled: false},
        movie: {enabled: false},
        music: {enabled: false},
        audiobook: {enabled: false}
      };

      return filtersResetState;
    }

    default: {
      return state;
    }
  }
}
