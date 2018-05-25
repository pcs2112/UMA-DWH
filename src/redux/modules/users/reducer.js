import { replaceObjByValue } from 'helpers/array';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

/**
 * ETL run check reducer.
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
    case actionTypes.CREATE_SUCCESS: {
      const newData = state.data.slice();
      newData.push({ ...action.response });
      return {
        ...state,
        data: newData
      };
    }
    case actionTypes.UPDATE_SUCCESS:
      return {
        ...state,
        data: replaceObjByValue(state.data, { ...action.response }, action.id)
      };
    default:
      return state;
  }
};
