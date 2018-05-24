import isEqual from 'lodash/isEqual';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  intervalDuration: 15000
}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

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
      return itemListReducer(state, action);
    case actionTypes.FETCH_SUCCESS: {
      if (!isEqual(state.data, action.response)) {
        return itemListReducer(state, action);
      }

      return {
        ...state,
        isFetching: false
      };
    }
    case actionTypes.SET_INTERVAL_DURATION:
      return {
        ...state,
        intervalDuration: action.intervalDuration
      };
    default:
      return state;
  }
};
