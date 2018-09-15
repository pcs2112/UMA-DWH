export const actionTypes = {
  FETCH_BEGIN: 'reportHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'reportHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'reportHistory/FETCH_FAIL',
  RESET: 'reportHistory/RESET'
};

/**
 * Action to fetch the report history.
 */
export const fetchReportHistory = (startDate = '', endDate = '') => ({
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
