export const actionTypes = {
  FETCH_BEGIN: 'etlProcedureHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlProcedureHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'etlProcedureHistory/FETCH_FAIL',
  RESET: 'etlProcedureHistory/RESET',
  SET_INITIAL_FILTERS: 'etlProcedureHistory/SET_INITIAL_FILTERS'
};

/**
 * Action to fetch the ETL current status.
 */
export const fetchHistory = (serverName, dbName, procedureName, date) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/procedure_history', {
    params: {
      db_name: dbName,
      procedure_name: procedureName,
      date
    }
  }),
  payload: {
    serverName,
    dbName,
    procedureName,
    date
  }
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Sets the initial filters.
 */
export const setInitialFilters = (serverName, dbName, procedureName, date) => ({
  type: actionTypes.SET_INITIAL_FILTERS,
  serverName,
  dbName,
  procedureName,
  date
});
