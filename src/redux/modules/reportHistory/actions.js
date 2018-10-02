export const actionTypes = {
  FETCH_BEGIN: 'reportHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'reportHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'reportHistory/FETCH_FAIL',
  FETCH_LAST_DATE_BEGIN: 'reportHistory/FETCH_LAST_DATE_BEGIN',
  FETCH_LAST_DATE_SUCCESS: 'reportHistory/FETCH_LAST_DATE_SUCCESS',
  FETCH_LAST_DATE_FAIL: 'reportHistory/FETCH_LAST_DATE_FAIL',
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
      date
    }
  }),
  payload: {
    reportName,
    date,
    months
  }
});

/**
 * Fetches the last date the reports were ran.
 */
export const fetchLastDate = () => ({
  types: [
    actionTypes.FETCH_LAST_DATE_BEGIN,
    actionTypes.FETCH_LAST_DATE_SUCCESS,
    actionTypes.FETCH_LAST_DATE_FAIL
  ],
  makeRequest: client => client.get('/api/etl/reports/last_date')
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
