import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import crudReducerFor, { initialState as crudInitialState } from '../../reducers/crudReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({}, itemListInitialState, crudInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const crudReducer = crudReducerFor(actionTypes);

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
      return crudReducer(state, action);
    default:
      return state;
  }
};
