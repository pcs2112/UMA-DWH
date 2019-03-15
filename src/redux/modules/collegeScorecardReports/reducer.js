import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  currentId: false
}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

/**
 * College scorecard reports reducer.
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
    case actionTypes.FETCH_REPORT_SUCCESS: {
      const { data } = state;
      const { currentId, response } = action;
      const idx = data.findIndex(item => item.id === currentId);
      if (idx < 0) {
        return state;
      }

      const newData = [...data];
      const current = { ...response };
      newData[idx] = current;

      return {
        ...state,
        data: newData,
        current
      };
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    default:
      return state;
  }
};
