import { isEmpty } from 'javascript-utils/lib/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { initialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  isQueuingStats: false,
  isDequeuingStats: false
}, itemListInitialState, itemListSelectInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(actionTypes);

// Removes the processed items from the selected list
const removeProcessed = (state, action) => {
  const { data } = action;

  const selected = {
    ...state.selected
  };

  data.forEach((item) => {
    delete (selected[item.id]);
  });

  const selectedOrder = state.selectedOrder.filter(item => data.indexOf(item) < 0);

  return {
    ...state,
    selected,
    selectedOrder
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
    case actionTypes.SELECT_ALL: {
      const { key, data } = action;
      const selected = {};
      const selectedOrder = [];

      if (data.length > 0) {
        data.forEach((item) => {
          if (isEmpty(item.queued_dttm)) {
            selected[item[key]] = item;
            selectedOrder.push(item[key]);
          }
        });
      }

      return {
        ...state,
        selected,
        selectedOrder
      };
    }
    case actionTypes.SELECT:
    case actionTypes.UNSELECT:
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
