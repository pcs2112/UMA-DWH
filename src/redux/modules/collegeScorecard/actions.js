export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecard/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecard/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecard/FETCH_FAIL',
  RESET: 'collegeScorecard/RESET',
  SELECT: 'collegeScorecard/SELECT',
  UNSELECT: 'collegeScorecard/UNSELECT'
};

/**
 * Action to fetch the College scorecard data.
 */
export const fetch = (fileName, populated = '') => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/data/details', {
    params: {
      mode: 'DETAIL',
      filename: fileName,
      populated
    }
  }),
  payload: {
    fileName,
    populated
  }
});

/**
 * Resets the state.
 */
export const reset = () => ({
  type: actionTypes.RESET
});

/**
 * Action to select items.
 */
export const select = (id, data) => ({
  type: actionTypes.SELECT,
  id,
  data
});

/**
 * Action to unselect an item.
 */
export const unselect = id => ({
  type: actionTypes.UNSELECT,
  id
});
