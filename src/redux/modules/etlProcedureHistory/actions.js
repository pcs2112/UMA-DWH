export const actionTypes = {
  FETCH_BEGIN: 'etlProcedureHistory/FETCH_BEGIN',
  FETCH_SUCCESS: 'etlProcedureHistory/FETCH_SUCCESS',
  FETCH_FAIL: 'etlProcedureHistory/FETCH_FAIL',
  RESET: 'etlProcedureHistory/RESET',
  SET_INITIAL_PROCEDURE: 'etlProcedureHistory/SET_INITIAL_PROCEDURE'
};

/**
 * Action to fetch the ETL current status.
 */
export const fetchHistory = (serverName, dbName, procedureName) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/procedure_history', {
    params: {
      db_name: dbName,
      procedure_name: procedureName
    }
  }),
  payload: {
    serverName,
    dbName,
    procedureName
  }
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Sets the initial procedure.
 */
export const setInitialProcedure = (serverName, dbName, procedureName) => ({
  type: actionTypes.SET_INITIAL_PROCEDURE,
  serverName,
  dbName,
  procedureName
});
