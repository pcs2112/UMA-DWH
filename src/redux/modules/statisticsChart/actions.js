export const actionTypes = {
  FETCH_BEGIN: 'statisticsChart/FETCH_BEGIN',
  FETCH_SUCCESS: 'statisticsChart/FETCH_SUCCESS',
  FETCH_FAIL: 'statisticsChart/FETCH_FAIL',
  RESET: 'statisticsChart/RESET'
};

/**
 * Action to fetch the DWH statistics chart data.
 */
export const fetch = (schema, date, months) => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/etl/statistics/chart', {
    params: {
      schema,
      date,
      months
    }
  }),
  payload: {
    schema,
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
