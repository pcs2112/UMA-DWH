export const actionTypes = {
  FETCH_BEGIN: 'etlControlManagerDetails/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlControlManagerDetails/FETCH_SUCCESS',
  FETCH_FAIL: 'etlControlManagerDetails/FETCH_FAIL',
  RESET: 'etlControlManagerDetails/RESET'
};

/**
 * Action to fetch the ETL control manager details data.
 */
export const fetch = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/control_manager/details'),
  shouldMakeRequest: getState => !getState().etlControlManagerDetails.dataLoaded
});
