export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardReports/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardReports/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardReports/FETCH_FAIL',
  RESET: 'collegeScorecardReports/RESET'
};

/**
 * Action to fetch the College scorecard reports.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/reports')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
