export const actionTypes = {
  FETCH_BEGIN: 'powerbiReportRuns/FETCH_BEGIN',
  FETCH_SUCCESS: 'powerbiReportRuns/FETCH_SUCCESS',
  FETCH_FAIL: 'powerbiReportRuns/FETCH_FAIL',
  RESET: 'powerbiReportRuns/RESET'
};

/**
 * Action to the Power BI report runs.
 */
export const fetchPowerbiReportRuns = reportName => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/powerbi_report_runs', {
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
