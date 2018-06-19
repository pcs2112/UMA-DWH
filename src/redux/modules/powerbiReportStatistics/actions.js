export const actionTypes = {
  FETCH_BEGIN: 'powerbiReportStatistics/FETCH_BEGIN',
  FETCH_SUCCESS: 'powerbiReportStatistics/FETCH_SUCCESS',
  FETCH_FAIL: 'powerbiReportStatistics/FETCH_FAIL'
};

/**
 * Action to the Power BI report Statistics.
 */
export const fetchPowerbiReportStatistics = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/powerbi_report_statistics')
});
