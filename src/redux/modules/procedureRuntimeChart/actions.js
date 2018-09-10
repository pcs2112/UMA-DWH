export const actionTypes = {
  FETCH_BEGIN: 'procedureRuntimeChart/FETCH_BEGIN',
  FETCH_SUCCESS: 'procedureRuntimeChart/FETCH_SUCCESS',
  FETCH_FAIL: 'procedureRuntimeChart/FETCH_FAIL',
  RESET: 'procedureRuntimeChart/RESET',
  SET_INITIAL_FILTERS: 'procedureRuntimeChart/SET_INITIAL_FILTERS'
};

/**
 * Action to fetch the ETL procedure runtime chart data.
 */
export const fetch = (procedureName, date) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/procedure_runtime_chart_data', {
    params: {
      procedure_name: procedureName,
      date
    }
  }),
  payload: {
    procedureName,
    date
  }
});

/**
 * Sets the initial filters.
 */
export const setInitialFilters = (procedureName, date) => ({
  type: actionTypes.SET_INITIAL_FILTERS,
  procedureName,
  date
});
