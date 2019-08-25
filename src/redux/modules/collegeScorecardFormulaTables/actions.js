export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardFormulaTables/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardFormulaTables/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardFormulaTables/FETCH_FAIL',
  RESET: 'collegeScorecardFormulaTables/RESET'
};

/**
 * Action to fetch the College scorecard tables with formulas.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/formula_tables')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
