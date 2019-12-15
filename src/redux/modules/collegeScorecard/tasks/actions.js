export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardTasks/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardTasks/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardTasks/FETCH_FAIL',
  RESET: 'collegeScorecardTasks/RESET',
};

/**
 * Action to fetch the College scorecard tasks.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/tasks'),
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET,
});
