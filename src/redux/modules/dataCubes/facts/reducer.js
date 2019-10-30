import itemListReducerFor, { initialState as itemListInitialState } from '../../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { getInitialState as itemListSelectInitialState }
  from '../../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';
import {
  LIST_ITEM_KEY_NAME, SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

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
 * Facts reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.FETCH_SUCCESS: {
      const newState = itemListReducer(state, action);
      const { data } = newState;
      const factIdx = {};

      const newData = data.map((fact, i) => {
        const factTable = fact.fact_table.toUpperCase();
        factIdx[factTable] = i;
        return {
          fact_table: factTable
        };
      });

      return {
        ...newState,
        data: newData,
        factIdx
      };
    }
    case actionTypes.SELECT:
    case actionTypes.SELECT_ALL:
    case actionTypes.UNSELECT:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    case actionTypes.INIT_SELECTED: {
      const { selectedFacts, selectedFactsOrder } = action;
      return {
        ...state,
        selected: selectedFacts,
        selectedOrder: selectedFactsOrder
      };
    }
    default:
      return state;
  }
};
