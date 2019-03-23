import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { getInitialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';
import {
  LIST_ITEM_KEY_NAME, FILTERS_STATE_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

const defaultFilters = {
  query: '',
  active: 1,
  cycleDate: ''
};

// Initial state
const initialState = Object.assign(
  {
    currentCycleGroup: 0,
    startCycleGroup: 0,
    intervalDuration: 15000
  },
  filtersInitialState(defaultFilters, FILTERS_STATE_KEY_NAME),
  itemListInitialState,
  itemListSelectInitialState(SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME)
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(
  actionTypes, LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, FILTERS_STATE_KEY_NAME);

// Updates the item which new properties after a successful fetch
const filterData = (state, action) => {
  let newState;

  if (action.response) {
    newState = itemListReducer(state, action);
    newState.data.forEach((item, index) => {
      if (item.err_num > 0) {
        item.color_status = -2;
      } else if (item.try_catch_err_id > 0) {
        item.color_status = -1;
      } else if (item.table_status === 'RUNNING') {
        item.color_status = 1;
      } else if (item.table_status === 'NOT STARTED') {
        item.color_status = 2;
      } else {
        item.color_status = 3;
      }

      item.original_index = index;
    });
  } else {
    newState = {
      ...state,
      isFetching: false,
      fetchingError: initialState.fetchingError
    };
  }

  newState.currentCycleGroup = action.currentCycleGroup;
  newState.startCycleGroup = action.startCycleGroup;

  return newState;
};

/**
 * ETL history reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
      return itemListReducer(state, action);
    case actionTypes.FETCH_SUCCESS: {
      return filterData(setFilters(state, action), action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.CLEAR_FETCH_FAIL:
      return {
        ...state,
        fetchingError: initialState.fetchingError
      };
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    case actionTypes.SELECT:
    case actionTypes.UNSELECT:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    case actionTypes.SET_INTERVAL_DURATION:
      return {
        ...state,
        intervalDuration: action.intervalDuration
      };
    default:
      return state;
  }
};
