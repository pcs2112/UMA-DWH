export const actionTypes = {
  FETCH_BEGIN: 'reportHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'reportHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'reportHistory/FETCH_FAIL',
  RESET: 'reportHistory/RESET',
  SET_FILTERS: 'reportHistory/SET_FILTERS'
};

/**
 * Action to fetch the report history.
 */
export const fetchReportHistory = (reportName, date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/report_history', {
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
 * Sets the filters.
 */
export const setFilters = (reportName, date, months) => ({
  type: actionTypes.SET_FILTERS,
  reportName,
  date,
  months
});
