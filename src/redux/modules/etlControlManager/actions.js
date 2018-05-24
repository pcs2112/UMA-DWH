export const actionTypes = {
  FETCH_BEGIN: 'etlControlManager/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlControlManager/FETCH_SUCCESS',
  FETCH_FAIL: 'etlControlManager/FETCH_FAIL',
  RESET: 'etlControlManager/RESET'
};

/**
 * Action to fetch the ETL control manager data.
 */
export const fetchControlManager = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/control_manager'),
  shouldMakeRequest: getState => !getState().etlControlManager.dataLoaded
});
