import { isEmpty } from 'javascript-utils/src/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import crudListReducerFor, { initialState as crudListInitialState } from '../../reducers/crudListReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';
import { FILTERS_STATE_KEY_NAME } from './constants';

const defaultFilters = {
  query: ''
};

// Initial state
const initialState = Object.assign(
  {},
  filtersInitialState(defaultFilters, FILTERS_STATE_KEY_NAME),
  itemListInitialState,
  crudListInitialState
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const crudListReducer = crudListReducerFor(actionTypes);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, FILTERS_STATE_KEY_NAME);

// Filters the data
const filterData = (state, action) => {
  const { data, [FILTERS_STATE_KEY_NAME]: { query } } = state;
  let { allData } = state;

  if (action.type === actionTypes.FETCH_SUCCESS) {
    allData = data;
  }

  let newData = [];

  if (!isEmpty(query) && query.length >= 3) {
    const queryNormalized = query.toLowerCase();
    newData = newData.filter((item) => {
      const normalizedCategoryName = `${item.category_name}`.toLowerCase();
      return normalizedCategoryName.indexOf(queryNormalized) > -1;
    });
  }

  return {
    ...state,
    data: newData,
    allData
  };
};

/**
 * College scorecard categories reducer.
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
      const newState = setFilters(itemListReducer(state, action), action);
      return filterData(newState, action);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SET_FILTERS:
      return filterData(setFilters(state, action), action);
    case actionTypes.CREATE_SUCCESS:
    case actionTypes.UPDATE_SUCCESS:
    case actionTypes.UPDATING_START:
    case actionTypes.UPDATING_END:
      return crudListReducer(state, action);
    default:
      return state;
  }
};
