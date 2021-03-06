import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

// Set the filters
const setFilters = (state, action) => {
  const newState = { ...state };
  newState.serverName = action.serverName;
  newState.dbName = action.dbName;
  newState.procedureName = action.procedureName;
  newState.date = action.date;
  newState.months = action.months;
  return newState;
};

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
    case actionTypes.FETCH_SUCCESS: {
      const newState = itemListReducer(state, action);
      return setFilters(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    default:
      return state;
  }
};
