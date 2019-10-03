export const actionTypes = {
  FETCH_BEGIN: 'dataLakeEntries/FETCH_BEGIN',
  FETCH_SUCCESS: 'dataLakeEntries/FETCH_SUCCESS',
  FETCH_FAIL: 'dataLakeEntries/FETCH_FAIL',
  RESET: 'dataLakeEntries/RESET'
};

/**
 * Action to load the entries.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/data_lake/entries')
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});
