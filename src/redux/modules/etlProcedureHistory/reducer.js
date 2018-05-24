import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

// Set the procedure data
const setProcedure = (state, action) => {
  const newState = { ...state };
  newState.serverName = action.serverName;
  newState.dbName = action.dbName;
  newState.procedureName = action.procedureName;
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
      return setProcedure(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SET_INITIAL_PROCEDURE:
      return setProcedure(state, action);
    default:
      return state;
  }
};
