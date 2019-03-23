import { objectHasOwnProperty } from 'javascript-utils/src/utils';

export const getInitialState = (defaultFilters, filtersStateKey = 'filters') => ({
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
}, defaultFilters, filtersStateKey = 'filters') =>
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

        const newState = {
          ...state
        };

        let setNewFilters = true;
        keys.forEach((key) => {
          if (objectHasOwnProperty(action, key)) {
            if (setNewFilters) {
              newState[filtersStateKey] = {
                ...newState[filtersStateKey]
              };

              setNewFilters = false;
            }

            newState[filtersStateKey][key] = action[key];
          }
        });

        return newState;
      }
      default:
        return state;
    }
  };

export default itemListFiltersReducerFor;
