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
  date: '',
  months: '',
  query: '',
  hide911: true
};

// Initial state
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
    allData, filters: { query, hide911 }
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

  let newData = allData.slice();

  // Filter by query value
  if (!isEmpty(query) && query.length >= 3) {
    const queryNormalized = query.toLowerCase();
    newData = allData.filter((item) => {
      const normalizedErrorProcedure = `${item.error_procedure}`.toLowerCase();
      const normalizedErrorMessage = `${item.error_message}`.toLowerCase();
      return normalizedErrorProcedure.indexOf(queryNormalized) > -1
        || normalizedErrorMessage.indexOf(queryNormalized) > -1;
    });
  }

  // Filter by error_number
  if (hide911) {
    newData = newData.filter(item => `${item.error_number}` !== '911');
  }

  return {
    ...state,
    data: newData
  };
};

/**
 * ETL try catch errors reducer.
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
    default:
      return state;
  }
};
