import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import crudListReducerFor, { initialState as crudListInitialState } from '../../reducers/crudListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({}, itemListInitialState, crudListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const crudListReducer = crudListReducerFor(actionTypes);

/**
 * Error type management reducer.
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
      return itemListReducer(state, action);
    case actionTypes.CREATE_SUCCESS:
    case actionTypes.UPDATE_SUCCESS:
    case actionTypes.UPDATING_START:
    case actionTypes.UPDATING_END:
      return crudListReducer(state, action);
    default:
      return state;
  }
};
