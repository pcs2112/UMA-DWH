export const actionTypes = {
  FETCH_BEGIN: 'statisticsSchemas/FETCH_BEGIN',
  FETCH_SUCCESS: 'statisticsSchemas/FETCH_SUCCESS',
  FETCH_FAIL: 'statisticsSchemas/FETCH_FAIL',
  RESET: 'statisticsSchemas/RESET',
  SET_FILTERS: 'statisticsSchemas/SET_FILTERS'
};

/**
 * Action to fetch the DWH statistics schemas.
 */
export const fetch = date => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/statistics/schemas', {
    params: {
      date
    }
  }),
  payload: {
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
export const setFilters = date => ({
  type: actionTypes.SET_FILTERS,
  date
});
