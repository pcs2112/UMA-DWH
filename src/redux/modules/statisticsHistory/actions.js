import { FILTERS_STATE_KEY_NAME } from './constants';
import { createSetFilterAction, createSetFiltersAction } from '../../reducers/itemListFiltersReducerFor';

export const actionTypes = {
  FETCH_BEGIN: 'statisticsHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'statisticsHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'statisticsHistory/FETCH_FAIL',
  FETCH_LAST_DATE_BEGIN: 'statisticsHistory/FETCH_LAST_DATE_BEGIN',
  FETCH_LAST_DATE_SUCCESS: 'statisticsHistory/FETCH_LAST_DATE_SUCCESS',
  FETCH_LAST_DATE_FAIL: 'statisticsHistory/FETCH_LAST_DATE_FAIL',
  RESET: 'statisticsHistory/RESET',
  SET_FILTERS: 'statisticsHistory/SET_FILTERS'
};

/**
 * Action to fetch the ETL statistics.
 */
export const fetch = (schema, date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/statistics/history', {
    params: {
      schema,
      date
    }
  }),
  payload: {
    schema,
    date,
    months
  }
});

/**
 * Fetches the last date the statistics were ran.
 */
export const fetchLastDate = () => ({
  types: [
    actionTypes.FETCH_LAST_DATE_BEGIN,
    actionTypes.FETCH_LAST_DATE_SUCCESS,
    actionTypes.FETCH_LAST_DATE_FAIL
  ],
  makeRequest: client => client.get('/api/etl/statistics/last_date')
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
