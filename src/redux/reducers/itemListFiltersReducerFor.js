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
        const defaultFilterKeys = Object.keys(defaultFilters);
        if (defaultFilterKeys.length < 1) {
          return state;
        }

        let newFilters = {};
        if (objectHasOwnProperty(action, filtersStateKey)) {
          newFilters = action[filtersStateKey];
        } else {
          defaultFilterKeys.forEach((defaultFilterKey) => {
            if (objectHasOwnProperty(action, defaultFilterKey)) {
              newFilters[defaultFilterKey] = action[defaultFilterKey];
            }
          });
        }

        const newFilterKeys = Object.keys(newFilters);
        if (newFilterKeys.length < 1) {
          return state;
        }

        // Check the filters have changed
        let filtersChanged = false;
        const oldFilters = state[filtersStateKey];
        newFilterKeys.forEach((newFilterKey) => {
          if (newFilters[newFilterKey] !== oldFilters[newFilterKey]) {
            filtersChanged = true;
          }
        });

        if (!filtersChanged) {
          return state;
        }

        return {
          ...state,
          [filtersStateKey]: {
            ...oldFilters,
            ...newFilters
          }
        };
      }
      default:
        return state;
    }
  };

export default itemListFiltersReducerFor;
