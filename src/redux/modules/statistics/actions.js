export const actionTypes = {
  FETCH_BEGIN: 'statistics/FETCH_BEGIN',
  FETCH_SUCCESS: 'statistics/FETCH_SUCCESS',
  FETCH_FAIL: 'statistics/FETCH_FAIL',
  RESET: 'statistics/RESET',
  SET_FILTERS: 'statistics/SET_FILTERS'
};

/**
 * Action to fetch the ETL statistics.
 */
export const fetch = (schema, date) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/statistics', {
    params: {
      schema,
      date
    }
  }),
  payload: {
    schema,
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
 * Sets the filters.
 */
export const setFilters = (schema, date) => ({
  type: actionTypes.SET_FILTERS,
  schema,
  date
});
