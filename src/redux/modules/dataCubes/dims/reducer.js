import itemListReducerFor, { initialState as itemListInitialState } from '../../../reducers/itemListReducerFor';
import { getInitialState as itemListSelectInitialState } from '../../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';
import { actionTypes as factsActionTypes } from '../facts/actions';
import {
  SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME
} from './constants';

// Initial state
const initialState = Object.assign(
  {},
  itemListInitialState,
  itemListSelectInitialState(SELECTED_STATE_KEY_NAME, SELECTED_ORDER_STATE_KEY_NAME)
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

/**
 * Dims reducer.
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
      const dimIdx = {};

      const newData = data.map((dim, i) => {
        const fact = dim.fact_table.toUpperCase();
        const column = dim.column_name.toUpperCase();
        const id = `${fact}.${column}`;
        const label = `${fact}.${dim.dimension_name}`;
        dimIdx[id] = i;
        return {
          ...dim,
          id,
          label,
          column_name: column,
          fact_table: fact
        };
      });

      return {
        ...newState,
        data: newData,
        dimIdx
      };
    }
    case actionTypes.SELECT: {
      // Add the selected item
      const selected = {
        ...state.selected
      };

      selected[action.data.fact_table] = {
        ...selected[action.data.fact_table],
        [action.data.id]: action.data
      };

      // Add the selected item to the selected order
      const selectedOrder = [...state.selectedOrder];
      selectedOrder.push(action.data.id);

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
      delete (selected[action.data.fact_table][action.data.id]);
      if (Object.keys(selected[action.data.fact_table]).length < 1) {
        delete (selected[action.data.fact_table]);
      }

      // Remove the unselected items from the selected order
      const selectedOrder = state.selectedOrder.filter(item => item !== action.data.id);

      return {
        ...state,
        selected,
        selectedOrder
      };
    }
    case actionTypes.UNSELECT_ALL:
      return {
        ...state,
        selected: {},
        selectedOrder: []
      };
    case factsActionTypes.INIT_SELECTED: {
      const { selectedDims, selectedDimsOrder } = action;
      return {
        ...state,
        selected: selectedDims,
        selectedOrder: selectedDimsOrder
      };
    }
    default:
      return state;
  }
};
