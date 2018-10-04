export const actionTypes = {
  FETCH_BEGIN: 'statistics/FETCH_BEGIN',
  FETCH_SUCCESS: 'statistics/FETCH_SUCCESS',
  FETCH_FAIL: 'statistics/FETCH_FAIL',
  FETCH_LAST_DATE_BEGIN: 'statistics/FETCH_LAST_DATE_BEGIN',
  FETCH_LAST_DATE_SUCCESS: 'statistics/FETCH_LAST_DATE_SUCCESS',
  FETCH_LAST_DATE_FAIL: 'statistics/FETCH_LAST_DATE_FAIL',
  RESET: 'statistics/RESET',
  SET_FILTERS: 'statistics/SET_FILTERS',
  SELECT: 'statistics/SELECT',
  UNSELECT: 'statistics/UNSELECT',
  UNSELECT_ALL: 'statistics/UNSELECT_ALL',
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
  makeRequest: client => client.get('/api/etl/statistics', {
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
 * Sets the filters.
 */
export const setFilters = (schema, date, months) => ({
  type: actionTypes.SET_FILTERS,
  schema,
  date,
  months
});

/**
 * Action to select a statistics item.
 */
export const select = (id, data) => ({
  type: actionTypes.SELECT,
  id,
  data
});

/**
 * Action to unselect a statistics item.
 */
export const unselect = id => ({
  type: actionTypes.UNSELECT,
  id
});

/**
 * Action to unselect all statistics items.
 */
export const unselectAll = () => ({
  type: actionTypes.UNSELECT_ALL
});
