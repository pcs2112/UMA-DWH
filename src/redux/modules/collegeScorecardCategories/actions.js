export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardCategories/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardCategories/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardCategories/FETCH_FAIL',
  RESET: 'collegeScorecardCategories/RESET'
};

/**
 * Action to fetch the College scorecard categories.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/categories')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
