export const actionTypes = {
  FETCH_BEGIN: 'etlCurrentStatus/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlCurrentStatus/FETCH_SUCCESS',
  FETCH_FAIL: 'etlCurrentStatus/FETCH_FAIL',
  RESET: 'etlCurrentStatus/RESET'
};

/**
 * Action to fetch the ETL current status.
 */
export const fetchCurrentStatus = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/data_marts_status')
});
