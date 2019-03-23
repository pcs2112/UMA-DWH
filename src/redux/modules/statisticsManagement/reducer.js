import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { getInitialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';
import {
  LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

// Initial state
const initialState = Object.assign(
  {
    isQueuingStats: false,
    isDequeuingStats: false
  },
  itemListInitialState,
  itemListSelectInitialState(SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME)
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(
  actionTypes, LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
);

// Removes the processed items from the selected list
const removeProcessed = (state, action) => {
  const { data } = action;

  const selected = {
    ...state[SELECTED_STATE_KEY_NAME]
  };

  data.forEach((item) => {
    delete (selected[item.id]);
  });

  const selectedOrder = state[SELECTED_ORDER_STATE_KEY_NAME].filter(item => data.indexOf(item) < 0);

  return {
    ...state,
    [SELECTED_STATE_KEY_NAME]: selected,
    [SELECTED_ORDER_STATE_KEY_NAME]: selectedOrder
  };
};

/**
 * DWH statistics reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
    case actionTypes.FETCH_SUCCESS:
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SELECT:
    case actionTypes.UNSELECT:
    case actionTypes.SELECT_ALL:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    case actionTypes.QUEUE_STATS_BEGIN:
      return {
        ...state,
        isQueuingStats: true
      };
    case actionTypes.QUEUE_STATS_SUCCESS: {
      const newState = removeProcessed(state, action);
      newState.isQueuingStats = false;
      return newState;
    }
    case actionTypes.QUEUE_STATS_FAIL:
      return {
        ...state,
        isQueuingStats: false
      };
    case actionTypes.DEQUEUE_STATS_BEGIN:
      return {
        ...state,
        isDequeuingStats: true
      };
    case actionTypes.DEQUEUE_STATS_SUCCESS: {
      const newState = removeProcessed(state, action);
      newState.isDequeuingStats = false;
      return newState;
    }
    case actionTypes.DEQUEUE_STATS_FAIL:
      return {
        ...state,
        isDequeuingStats: false
      };
    default:
      return state;
  }
};
