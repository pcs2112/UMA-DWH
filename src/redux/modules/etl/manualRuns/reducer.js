import itemListReducerFor, { initialState as itemListInitialState } from '../../../reducers/itemListReducerFor';
import crudListReducerFor, { initialState as crudListInitialState } from '../../../reducers/crudListReducerFor';
import itemListFiltersReducerFor, { getInitialState as filtersInitialState }
  from '../../../reducers/itemListFiltersReducerFor';
import { actionTypes } from './actions';

const defaultFilters = {
  domain: []
};

// Initial state
const initialState = Object.assign(
  {
    isClearingAll: false,
    domains: []
  },
  filtersInitialState(defaultFilters, 'filters'),
  itemListInitialState,
  crudListInitialState
);

// Create helper reducers
const itemListReducer = itemListReducerFor(actionTypes);
const crudListReducer = crudListReducerFor(actionTypes);
const setFilters = itemListFiltersReducerFor(actionTypes, defaultFilters, 'filters');

// Filters the data
const filterData = (state, action) => {
  const { data, filters: { domain }, domains } = state;
  let { allData } = state;
  let newDomains;

  if (action.type === actionTypes.FETCH_SUCCESS) {
    newDomains = {};
    allData = data.map((item) => {
      newDomains[item.domain] = item.domain;
      return {
        ...item,
        id: `${item.domain.toUpperCase()}.${item.stored_procedure.toUpperCase()}`,
        domain: item.domain.toUpperCase()
      };
    });
  }

  let newData = [];

  if (domain.length < 1) {
    newData = allData;
  } else {
    newData = allData.filter((item) => domain.indexOf(item.domain) > -1);
  }

  return {
    ...state,
    data: newData,
    allData,
    domains: newDomains ? Object.keys(newDomains).sort() : domains
  };
};

/**
 * Manual runs reducer.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BEGIN:
    case actionTypes.FETCH_FAIL:
    case actionTypes.RESET:
      return itemListReducer(state, action);
    case actionTypes.FETCH_SUCCESS:
      return filterData(setFilters(itemListReducer(state, action), action), action);
    case actionTypes.SET_FILTERS:
      return filterData(setFilters(state, action), action);
    case actionTypes.UPDATING_START:
    case actionTypes.UPDATING_END:
      return crudListReducer(state, action);
    case actionTypes.CLEARALL_BEGIN:
      return {
        ...state,
        isClearingAll: true
      };
    case actionTypes.CLEARALL_SUCCESS:
    case actionTypes.CLEARALL_FAIL:
      return {
        ...state,
        isClearingAll: false
      };
    default:
      return state;
  }
};
