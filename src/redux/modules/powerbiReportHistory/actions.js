export const actionTypes = {
  FETCH_BEGIN: 'powerbiReportHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'powerbiReportHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'powerbiReportHistory/FETCH_FAIL'
};

/**
 * Action to the Power BI report history.
 */
export const fetchPowerbiReportHistory = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/powerbi_report_history')
});
