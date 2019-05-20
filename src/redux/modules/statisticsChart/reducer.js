import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';
import { actionTypes as historyActionTypes } from '../statisticsHistory/actions';
import {
  FILTERS_STATE_KEY_NAME
} from './constants';

// Initial state
const defaultFilters = {
  schema: '',
  date: '',
  months: ''
};

// Initial state
const initialState = Object.assign(
  filtersInitialState(defaultFilters, FILTERS_STATE_KEY_NAME),
  itemListInitialState
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, FILTERS_STATE_KEY_NAME);

/**
 * ETL statistics chart data reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
    case actionTypes.FETCH_SUCCESS: {
      const newState = itemListReducer(state, action);
      return setFilters(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    case historyActionTypes.FETCH_LAST_DATE_SUCCESS:
      return {
        ...state,
        [FILTERS_STATE_KEY_NAME]: {
          ...state[FILTERS_STATE_KEY_NAME],
          date: action.response[0].last_date,
          staled_stats: action.response[0].staled_stats === 1
        }
      };
    default:
      return state;
  }
};
