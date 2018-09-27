export const actionTypes = {
  FETCH_BEGIN: 'reports/FETCH_BEGIN',
  FETCH_SUCCESS: 'reports/FETCH_SUCCESS',
  FETCH_FAIL: 'reports/FETCH_FAIL',
  RESET: 'reports/RESET',
  SET_FILTERS: 'reports/SET_FILTERS'
};

/**
 * Action to fetch the ETL reports.
 */
export const fetch = (date = '') => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/reports', {
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
