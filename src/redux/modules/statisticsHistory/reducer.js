import { isEmpty } from 'javascript-utils/lib/utils';
import itemListReducerFor, { initialState as itemListInitialState } from '../../reducers/itemListReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';
import {
  FILTERS_STATE_KEY_NAME
} from './constants';

// Initial state
const defaultFilters = {
  schema: '',
  date: '',
  months: '',
  query: ''
};

const initialState = Object.assign(
  {
    allData: false
  },
  filtersInitialState(defaultFilters, FILTERS_STATE_KEY_NAME),
  itemListInitialState
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, FILTERS_STATE_KEY_NAME);

// Filters the data by the filter values
const filterData = (state) => {
  const {
    allData, filters: { query }
  } = state;

  if (!allData) {
    return state;
  }

  if (allData.length < 1) {
    return {
      ...state,
      data: []
    };
  }

  // Filter by query value
  let newData = allData.slice();

  if (!isEmpty(query) && query.length >= 3) {
    const queryNormalized = query.toLowerCase();
    newData = allData.filter((item) => {
      const normalizedServer = `${item.server}`.toLowerCase();
      const normalizedDatabase = `${item.database}`.toLowerCase();
      const normalizedSchema = `${item.schema}`.toLowerCase();
      const normalizedTable = `${item.table}`.toLowerCase();
      const normalizedTableFull = `${item.table_full}`.toLowerCase();
      return normalizedServer.indexOf(queryNormalized) > -1
        || normalizedDatabase.indexOf(queryNormalized) > -1
        || normalizedSchema.indexOf(queryNormalized) > -1
        || normalizedTable.indexOf(queryNormalized) > -1
        || normalizedTableFull.indexOf(queryNormalized) > -1;
    });
  }

  return {
    ...state,
    data: newData
  };
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
      return itemListReducer(state, action);
    case actionTypes.FETCH_SUCCESS: {
      const { response } = action;
      const newStateWithList = itemListReducer(state, action);
      newStateWithList.allData = [...response];

      const newStateWithFilters = setFilters(newStateWithList, action);
      return filterData(newStateWithFilters);
    }
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.SET_FILTERS: {
      const newStateWithFilters = setFilters(state, action);
      return filterData(newStateWithFilters);
    }
    case actionTypes.FETCH_LAST_DATE_SUCCESS:
      return {
        ...state,
        [FILTERS_STATE_KEY_NAME]: {
          ...state[FILTERS_STATE_KEY_NAME],
          date: action.response[0].last_date,
          staled_stats: action.response[0].staled_stats === 1
        }
      };
    default:
      return state;
  }
};
