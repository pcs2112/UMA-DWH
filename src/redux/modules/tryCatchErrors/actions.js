export const actionTypes = {
  FETCH_BEGIN: 'tryCatchErrors/FETCH_BEGIN',
  FETCH_SUCCESS: 'tryCatchErrors/FETCH_SUCCESS',
  FETCH_FAIL: 'tryCatchErrors/FETCH_FAIL',
  RESET: 'tryCatchErrors/RESET',
  SET_FILTERS: 'tryCatchErrors/SET_FILTERS'
};

/**
 * Action to fetch the ETL try catch errors.
 */
export const fetch = (date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/try_catch_errors', {
    params: {
      date,
      months
    }
  }),
  payload: {
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
 * Sets the filters.
 */
export const setFilters = date => ({
  type: actionTypes.SET_FILTERS,
  date
});
