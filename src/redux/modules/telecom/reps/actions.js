export const actionTypes = {
  FETCH_BEGIN: 'telecomReps/FETCH_BEGIN',
  FETCH_SUCCESS: 'telecomReps/FETCH_SUCCESS',
  FETCH_FAIL: 'telecomReps/FETCH_FAIL',
  RESET: 'telecomReps/RESET'
};

/**
 * Action to load the reps.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/telecom/reps')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
