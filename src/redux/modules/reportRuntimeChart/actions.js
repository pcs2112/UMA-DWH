export const actionTypes = {
  FETCH_BEGIN: 'reportRuntimeChart/FETCH_BEGIN',
  FETCH_SUCCESS: 'reportRuntimeChart/FETCH_SUCCESS',
  FETCH_FAIL: 'reportRuntimeChart/FETCH_FAIL',
  RESET: 'reportRuntimeChart/RESET',
  SET_FILTERS: 'reportRuntimeChart/SET_FILTERS'
};

/**
 * Action to fetch the ETL report runtime chart data.
 */
export const fetch = (reportName, date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/report_runtime_chart_data', {
    params: {
      report_name: reportName,
      date,
      months
    }
  }),
  payload: {
    reportName,
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
export const setFilters = (reportName, date, months) => ({
  type: actionTypes.SET_FILTERS,
  reportName,
  date,
  months
});
