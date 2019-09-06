export const actionTypes = {
  FETCH_BEGIN: 'telecomWorkgroups/FETCH_BEGIN',
  FETCH_SUCCESS: 'telecomWorkgroups/FETCH_SUCCESS',
  FETCH_FAIL: 'telecomWorkgroups/FETCH_FAIL'
};

/**
 * Action to load the workgroups.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/telecom/workgroups')
});
