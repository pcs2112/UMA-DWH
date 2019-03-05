import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { unselectAllReducer, initialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import itemListFiltersReducerFor from '../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';
import { actionTypes as collegeScorecardActionTypes } from '../collegeScorecard/actions';

const defaultFilters = {
  fileName: '',
  group: 'ALL'
};

// Initial state
const initialState = Object.assign({}, defaultFilters, itemListInitialState, itemListSelectInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(actionTypes, 'group_id');
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters);

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
    case actionTypes.FETCH_SUCCESS: {
      const newState = itemListReducer(state, action);
      return setFilters(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SELECT:
    case actionTypes.SELECT_ALL:
    case actionTypes.UNSELECT:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    case collegeScorecardActionTypes.UNSELECT_ALL:
      return unselectAllReducer(state);
    default:
      return state;
  }
};
