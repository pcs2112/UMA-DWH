import { objectHasOwnProperty } from 'javascript-utils/src/utils';

const FILTERS_STATE_KEY_NAME = 'filters';

/**
 * Action to set a filter.
 */
export const createSetFilterAction = (actionType, filtersStateKey = FILTERS_STATE_KEY_NAME) => (key, value) => ({
  type: actionType,
  [filtersStateKey]: {
    [key]: value
  }
});

/**
 * Action to set multiple filters.
 */
export const createSetFiltersAction = (actionType, filtersStateKey = FILTERS_STATE_KEY_NAME) => filters => ({
  type: actionType,
  [filtersStateKey]: filters
});

export const getInitialState = (defaultFilters, filtersStateKey = FILTERS_STATE_KEY_NAME) => ({
  [filtersStateKey]: {
    ...defaultFilters
  }
});

/**
 * Reusable factory reducer to set filters in a list.
 *
 * @param {Object} actionTypes
 * @param {String} filtersStateKey
 * @param {Object} defaultFilters
 * @returns {Function}
 */
const itemListFiltersReducerFor = ({
  FETCH_BEGIN, FETCH_FAIL, FETCH_SUCCESS, SET_FILTERS
}, defaultFilters, filtersStateKey = FILTERS_STATE_KEY_NAME) =>
  (state = getInitialState(defaultFilters, filtersStateKey), action) => {
    switch (action.type) {
      case FETCH_BEGIN:
      case FETCH_FAIL:
      case FETCH_SUCCESS:
      case SET_FILTERS: {
        const keys = Object.keys(defaultFilters);
        if (keys.length < 1) {
          return state;
        }

        let filters = {};
        if (objectHasOwnProperty(action, filtersStateKey)) {
          filters = action[filtersStateKey];
        } else {
          keys.forEach((key) => {
            if (objectHasOwnProperty(action, key)) {
              filters[key] = action[key];
            }
          });
        }

        if (Object.keys(filters).length < 1) {
          return state;
        }

        return {
          ...state,
          [filtersStateKey]: {
            ...state[filtersStateKey],
            ...filters
          }
        };
      }
      default:
        return state;
    }
  };

export default itemListFiltersReducerFor;
