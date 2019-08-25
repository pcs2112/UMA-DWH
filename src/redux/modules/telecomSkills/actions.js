
export const actionTypes = {
  FETCH_BEGIN: 'errorTypeResolution/FETCH_BEGIN',
  FETCH_SUCCESS: 'errorTypeResolution/FETCH_SUCCESS',
  FETCH_FAIL: 'errorTypeResolution/FETCH_FAIL'
};

/**
 * Action to load the error type resolution data.
 */
export const fetchFiles = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/telecom/skill')
});
