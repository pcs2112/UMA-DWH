export const actionTypes = {
  FETCH_BEGIN: 'telecomRoles/FETCH_BEGIN',
  FETCH_SUCCESS: 'telecomRoles/FETCH_SUCCESS',
  FETCH_FAIL: 'telecomRoles/FETCH_FAIL',
  RESET: 'telecomRoles/RESET'
};

/**
 * Action to load the roles.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/telecom/roles')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
