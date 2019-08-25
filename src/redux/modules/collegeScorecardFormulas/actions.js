export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardFormulas/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardFormulas/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardFormulas/FETCH_FAIL',
  RESET: 'collegeScorecardFormulas/RESET'
};

/**
 * Action to fetch the College scorecard formulas.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/formulas')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
