import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListSelectReducerFor, { initialState as itemListSelectInitialState }
  from '../../reducers/itemListSelectReducerFor';
import { actionTypes } from './actions';

// Initial state
const initialState = Object.assign({
  schema: '',
  date: '',
  months: ''
}, itemListInitialState, itemListSelectInitialState);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const itemListSelectReducer = itemListSelectReducerFor(actionTypes);

// Set the filters data
const setFilters = (state, action) => {
  const newState = { ...state };
  newState.schema = action.schema;
  newState.date = action.date;
  newState.months = action.months;
  return newState;
};

/**
 * DWH statistics history reducer.
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
    case actionTypes.FETCH_LAST_DATE_SUCCESS:
      return {
        ...state,
        date: action.response[0].last_date,
        staled_stats: action.response[0].staled_stats === 1
      };
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SET_FILTERS:
      return setFilters(state, action);
    case actionTypes.SELECT:
    case actionTypes.UNSELECT:
    case actionTypes.UNSELECT_ALL:
      return itemListSelectReducer(state, action);
    default:
      return state;
  }
};
