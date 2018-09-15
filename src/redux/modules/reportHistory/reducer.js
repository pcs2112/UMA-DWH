import { objectHasOwnProperty } from 'javascript-utils/lib/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({}, itemListInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);

// Set the filters data
const setFilters = (state, action) => {
  const newState = { ...state };
  if (objectHasOwnProperty(action, 'startDate')) {
    newState.startDate = action.startDate;
    newState.endDate = action.endDate;
  } else {
    delete (newState.startDate);
    delete (newState.endDate);
  }

  return newState;
};

/**
 * Report history reducer.
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
      return setFilters(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    default:
      return state;
  }
};
