export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecard/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecard/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecard/FETCH_FAIL',
  RESET: 'collegeScorecard/RESET'
};

/**
 * Action to fetch the College scorecard data.
 */
export const fetch = (filename = '') => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/data', {
    mode: 'DETAIL',
    filename
  })
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
