import isEqual from 'lodash/isEqual';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { unselectAllReducer, getInitialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';
import {
  LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';
import { actionTypes as etlCycleHistoryActionTypes } from '../etlCycleHistory/actions';

// Initial state
const initialState = Object.assign(
  {},
  itemListInitialState,
  itemListSelectInitialState(SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME)
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(
  actionTypes, LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
);

/**
 * ETL current status reducer.
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
      if (!isEqual(state.data, action.response)) {
        return itemListReducer(state, action);
      }

      return {
        ...state,
        isFetching: false
      };
    }
    case actionTypes.SELECT:
    case actionTypes.UNSELECT:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    case etlCycleHistoryActionTypes.UNSELECT_ALL:
      return unselectAllReducer(state, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME);
    default:
      return state;
  }
};
