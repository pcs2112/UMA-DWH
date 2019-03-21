import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  currentCycleGroup: 0,
  startCycleGroup: 0,
  cycleDate: '',
  selected: {},
  selectedOrder: [],
  filters: {
    query: '',
    active: 1
  },
  intervalDuration: 15000
}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

// Set filters
const setFilters = (state, action) => {
  if (!action.filter) {
    return state;
  }

  return {
    ...state,
    filters: {
      ...state.filters,
      [action.filter.key]: action.filter.value
    }
  };
};

// Updates the item which new properties after a successful fetch
const setItemList = (state, action) => {
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
  newState.cycleDate = action.cycleDate;

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
    case actionTypes.FETCH_SUCCESS:
      return setItemList(state, action);
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.CLEAR_FETCH_FAIL:
      return {
        ...state,
        fetchingError: initialState.fetchingError
      };
    case actionTypes.SELECT: {
      // Add the selected item
      const selected = {
        ...state.selected,
        [action.id]: action.data
      };

      // Add the selected item to the selected order
      const selectedOrder = [...state.selectedOrder];
      selectedOrder.push(action.id);

      return {
        ...state,
        selected,
        selectedOrder
      };
    }
    case actionTypes.UNSELECT: {
      const selected = {
        ...state.selected
      };

      // Remove the unselected item
      delete (selected[action.id]);

      // Remove the unselected items from the selected order
      const selectedOrder = state.selectedOrder.filter(item => item !== action.id);

      return {
        ...state,
        selected,
        selectedOrder
      };
    }
    case actionTypes.UNSELECT_ALL:
      return {
        ...state,
        selected: initialState.selected,
        selectedOrder: initialState.selectedOrder
      };
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    case actionTypes.SET_INTERVAL_DURATION:
      return {
        ...state,
        intervalDuration: action.intervalDuration
      };
    default:
      return state;
  }
};
