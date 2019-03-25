import { isEmpty } from 'javascript-utils/src/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';
import { FILTERS_STATE_KEY_NAME } from './constants';

const defaultFilters = {
  query: '',
  view: ''
};

// Initial state
const initialState = Object.assign(
  {},
  filtersInitialState(defaultFilters, FILTERS_STATE_KEY_NAME),
  itemListInitialState
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, FILTERS_STATE_KEY_NAME);

// Filters the data
const filterData = (state, action) => {
  const { data, [FILTERS_STATE_KEY_NAME]: { view, query } } = state;
  let { allData } = state;

  if (action.type === actionTypes.FETCH_SUCCESS) {
    allData = data;
  }

  let newData = [];

  if (view === 'ALL') {
    newData = allData;
  } else {
    newData = allData.filter((item) => {
      const normalizedProcedureName = `${item.procedure_name}`.toLowerCase();
      return normalizedProcedureName.indexOf('check_merge') < 0;
    });
  }

  if (!isEmpty(query) && query.length >= 3) {
    const queryNormalized = query.toLowerCase();
    newData = newData.filter((item) => {
      const normalizedProcedureName = `${item.procedure_name}`.toLowerCase();
      const normalizedDataMartName = `${item.data_mart_name}`.toLowerCase();

      return normalizedProcedureName.indexOf(queryNormalized) > -1
        || normalizedDataMartName.indexOf(queryNormalized) > -1;
    });
  }

  return {
    ...state,
    data: newData,
    allData
  };
};

/**
 * ETL management reducer.
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
    case actionTypes.RESET: {
      const newState = itemListReducer(state, action);
      return {
        ...newState,
        allData: false
      };
    }
    case actionTypes.SET_FILTERS:
      return filterData(setFilters(state, action), action);
    default:
      return state;
  }
};
