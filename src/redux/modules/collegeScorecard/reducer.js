import itemListReducerFor, { initialState as itemListInitialState } from 'redux/reducers/itemListReducerFor';
import itemListSelectReducerFor, { initialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({}, itemListInitialState, itemListSelectInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(actionTypes);

/**
 * College scorecard reducer.
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
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SELECT:
    case actionTypes.UNSELECT:
      return itemListSelectReducer(state, action);
    default:
      return state;
  }
};
