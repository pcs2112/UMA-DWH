export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardFiles/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardFiles/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardFiles/FETCH_FAIL',
  RESET: 'collegeScorecardFiles/RESET'
};

/**
 * Action to fetch the College scorecard files.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/files')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
