export const actionTypes = {
  FETCH_BEGIN: 'reports/FETCH_BEGIN',
  FETCH_SUCCESS: 'reports/FETCH_SUCCESS',
  FETCH_FAIL: 'reports/FETCH_FAIL',
  RESET: 'reports/RESET'
};

/**
 * Action to fetch the ETL reports.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/reports'),
  shouldMakeRequest: getState => !getState().reports.dataLoaded
});
