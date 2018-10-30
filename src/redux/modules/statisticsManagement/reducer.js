import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { initialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  isRunningStats: false
}, itemListInitialState, itemListSelectInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(actionTypes);

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
        isRunningStats: true
      };
    case actionTypes.QUEUE_STATS_SUCCESS:
    case actionTypes.QUEUE_STATS_FAIL:
      return {
        ...state,
        isRunningStats: false
      };
    default:
      return state;
  }
};
