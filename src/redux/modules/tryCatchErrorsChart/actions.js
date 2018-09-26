export const actionTypes = {
  FETCH_BEGIN: 'tryCatchErrorsChart/FETCH_BEGIN',
  FETCH_SUCCESS: 'tryCatchErrorsChart/FETCH_SUCCESS',
  FETCH_FAIL: 'tryCatchErrorsChart/FETCH_FAIL',
  RESET: 'tryCatchErrorsChart/RESET',
  SET_FILTERS: 'tryCatchErrorsChart/SET_FILTERS'
};

/**
 * Action to fetch the ETL procedure runtime chart data.
 */
export const fetch = (date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/try_catch_errors_chart_data', {
    params: {
      date,
      months
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
 * Sets filters.
 */
export const setFilters = (procedureName, date, months) => ({
  type: actionTypes.SET_FILTERS,
  date,
  months
});
