export const actionTypes = {
  FETCH_BEGIN: 'powerbiReportHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'powerbiReportHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'powerbiReportHistory/FETCH_FAIL',
  RESET: 'powerbiReportHistory/RESET'
};

/**
 * Action to the Power BI report history.
 */
export const fetchPowerbiReportHistory = (startDate = '', endDate = '') => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/powerbi_report_history', {
    params: {
      start_date: startDate,
      end_date: endDate
    }
  }),
  payload: {
    startDate,
    endDate
  }
});


/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
