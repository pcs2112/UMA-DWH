import itemListReducerFor, { initialState as itemListInitialState } from '../../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign(
  {},
  itemListInitialState
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

/**
 * Manual runs reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_SUCCESS:
    case actionTypes.FETCH_FAIL:
    case actionTypes.RESET:
      return itemListReducer(state, action);
    default:
      return state;
  }
};
