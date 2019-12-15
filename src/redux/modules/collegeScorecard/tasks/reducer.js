import itemListReducerFor, { initialState as itemListInitialState } from '../../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign(
  {
    isScheduling: false,
  },
  itemListInitialState,
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

/**
 * College scorecard tasks reducer.
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
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SCHEDULE_BEGIN:
      return {
        ...state,
        isScheduling: true,
      };
    case actionTypes.SCHEDULE_SUCCESS:
    case actionTypes.SCHEDULE_FAIL:
      return {
        ...state,
        isScheduling: false,
      };
    default:
      return state;
  }
};
