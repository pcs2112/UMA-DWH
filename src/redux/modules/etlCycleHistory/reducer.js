import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  currentCycleGroup: 0,
  startCycleGroup: 0,
  selected: {},
  selectedOrder: []
}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

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
      let newState;
      if (action.response) {
        newState = itemListReducer(state, action);
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
    }
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
    default:
      return state;
  }
};
