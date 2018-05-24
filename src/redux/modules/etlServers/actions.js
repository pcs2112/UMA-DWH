export const actionTypes = {
  FETCH_BEGIN: 'etlServers/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlServers/FETCH_SUCCESS',
  FETCH_FAIL: 'etlServers/FETCH_FAIL',
  RESET: 'etlServers/RESET'
};

/**
 * Action to fetch the ETL servers.
 */
export const fetchServers = () => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/servers'),
  shouldMakeRequest: getState => !getState().etlServers.dataLoaded
});
