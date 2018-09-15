export const actionTypes = {
  FETCH_BEGIN: 'reportStatistics/FETCH_BEGIN',
  FETCH_SUCCESS: 'reportStatistics/FETCH_SUCCESS',
  FETCH_FAIL: 'reportStatistics/FETCH_FAIL',
  RESET: 'reportStatistics/RESET'
};

/**
 * Action to the report Statistics.
 */
export const fetchReportStatistics = (reportName = 'ALL') => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/powerbi_report_statistics', {
    params: {
      report_name: reportName
    }
  }),
  payload: {
    reportName
  }
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
