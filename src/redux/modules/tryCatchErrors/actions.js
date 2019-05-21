import { FILTERS_STATE_KEY_NAME } from './constants';
import { createSetFilterAction, createSetFiltersAction } from '../../reducers/itemListFiltersReducerFor';

export const actionTypes = {
  FETCH_BEGIN: 'tryCatchErrors/FETCH_BEGIN',
  FETCH_SUCCESS: 'tryCatchErrors/FETCH_SUCCESS',
  FETCH_FAIL: 'tryCatchErrors/FETCH_FAIL',
  RESET: 'tryCatchErrors/RESET',
  SET_FILTERS: 'tryCatchErrors/SET_FILTERS'
};

/**
 * Action to fetch the ETL try catch errors.
 */
export const fetch = (date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/try_catch_errors', {
    params: {
      date
    }
  }),
  payload: {
    date,
    months
  }
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to set a filter.
 */
export const setFilter = createSetFilterAction(actionTypes.SET_FILTERS, FILTERS_STATE_KEY_NAME);

/**
 * Action to set multiple filters.
 */
export const setFilters = createSetFiltersAction(actionTypes.SET_FILTERS, FILTERS_STATE_KEY_NAME);
