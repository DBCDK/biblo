import parseJsonData from '../Utils/parseJsonData.js';
import * as types from '../Constants/action.constants';
import assignToEmpty from '../Utils/assign';


export default function listGroupsReducer(state, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case types.LIST_GROUPS: {
      if (action.groupType === 'new') {
        return assignToEmpty(state, {
          newLoading: false,
          newGroups: action.groups,
          newLimit: action.limit
        });
      }

      return assignToEmpty(state, {
        popularLoading: false,
        popularGroups: action.groups,
        popularLimit: action.limit
      });
    }

    case types.NEW_GROUPS_LIST_IS_LOADING: {
      return assignToEmpty(state, {
        newLoading: true
      });
    }

    case types.POPULAR_GROUPS_IS_LOADING: {
      return assignToEmpty(state, {
        popularLoading: true
      });
    }

    default: {
      let popularGroups = parseJsonData('JSONDATA', 'popularGroups');
      let newGroups = parseJsonData('JSONDATA', 'newGroups');

      return assignToEmpty(state, {
        newLoading: false,
        popularLoading: false,
        popularGroups,
        newGroups,
        newLimit: 15,
        popularLimit: 15
      });
    }
  }
}
