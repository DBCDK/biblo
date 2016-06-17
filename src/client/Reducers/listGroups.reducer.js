import * as types from '../Constants/action.constants';
import assignToEmpty from '../Utils/assign';

const initialState = {
  newLoading: false,
  popularLoading: false,
  popularGroups: [],
  newGroups: [],
  newLimit: 15,
  popularLimit: 15
};

export default function listGroupsReducer(state = initialState, action = {}) {
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
      return state;
    }
  }
}
