export const actionTypes = {
  FETCH_BEGIN: 'etlManualRuns/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlManualRuns/FETCH_SUCCESS',
  FETCH_FAIL: 'etlManualRuns/FETCH_FAIL',
  RESET: 'etlManualRuns/RESET'
};

/**
 * Action to load the manual runs.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/runs/manual')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
