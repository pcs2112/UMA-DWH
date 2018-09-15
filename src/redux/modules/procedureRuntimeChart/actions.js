export const actionTypes = {
  FETCH_BEGIN: 'procedureRuntimeChart/FETCH_BEGIN',
  FETCH_SUCCESS: 'procedureRuntimeChart/FETCH_SUCCESS',
  FETCH_FAIL: 'procedureRuntimeChart/FETCH_FAIL',
  RESET: 'procedureRuntimeChart/RESET',
  SET_FILTERS: 'procedureRuntimeChart/SET_FILTERS'
};

/**
 * Action to fetch the ETL procedure runtime chart data.
 */
export const fetch = (procedureName, date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/procedure_runtime_chart_data', {
    params: {
      procedure_name: procedureName,
      date,
      months
    }
  }),
  payload: {
    procedureName,
    date,
    months
  }
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Sets filters.
 */
export const setFilters = (procedureName, date, months) => ({
  type: actionTypes.SET_FILTERS,
  procedureName,
  date,
  months
});
