import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  currentCycleGroup: 0
}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

/**
 * Power BI report runs reducer.
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
      if (action.reportName) {
        newState.reportName = action.reportName;
      }

      if (action.currentCycleGroup) {
        newState.currentCycleGroup = action.currentCycleGroup;
      }

      return newState;
    }
    default:
      return state;
  }
};
