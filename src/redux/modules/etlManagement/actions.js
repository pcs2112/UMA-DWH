export const actionTypes = {
  FETCH_BEGIN: 'etlManagement/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlManagement/FETCH_SUCCESS',
  FETCH_FAIL: 'etlManagement/FETCH_FAIL',
  RESET: 'etlManagement/RESET'
};

/**
 * Action to fetch the ETL management.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/management')
});
