import { objectHasOwnProperty } from 'javascript-utils/src/utils';

export const initialState = {};

/**
 * Reusable factory reducer to set filters in a list.
 *
 * @param {Object} actionTypes
 * @param {Object} defaultFilters
 * @returns {Function}
 */
const itemListFiltersReducerFor = ({
  FETCH_BEGIN, FETCH_FAIL, FETCH_SUCCESS, SET_FILTERS
}, defaultFilters = {}) => (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BEGIN:
    case FETCH_FAIL:
    case FETCH_SUCCESS:
    case SET_FILTERS: {
      const keys = Object.keys(defaultFilters);
      if (keys.length < 1) {
        return state;
      }

      const newState = { ...state };

      keys.forEach((key) => {
        if (objectHasOwnProperty(action, key)) {
          newState[key] = action[key];
        }
      });

      return newState;
    }
    default:
      return state;
  }
};

export default itemListFiltersReducerFor;
