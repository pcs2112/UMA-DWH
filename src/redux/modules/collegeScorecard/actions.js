export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecard/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecard/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecard/FETCH_FAIL',
  RESET: 'collegeScorecard/RESET',
  SELECT: 'collegeScorecard/SELECT',
  SELECT_ALL: 'collegeScorecard/SELECT_ALL',
  UNSELECT: 'collegeScorecard/UNSELECT',
  UNSELECT_ALL: 'collegeScorecard/UNSELECT_ALL',
  SET_FILTERS: 'collegeScorecard/SET_FILTERS',
  REORDER: 'collegeScorecard/REORDER'
};

/**
 * Action to fetch the College scorecard data.
 */
export const fetch = fileName => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/data/details', {
    params: {
      mode: 'DETAIL',
      filename: fileName,
      populated: 'ALL'
    }
  }),
  payload: {
    fileName
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
export const select = data => ({
  type: actionTypes.SELECT,
  data
});

/**
 * Action to select all items.
 */
export const selectAll = keyName => ({
  type: actionTypes.SELECT_ALL,
  keyName
});


/**
 * Action to unselect an item.
 */
export const unselect = (keyValue, data) => ({
  type: actionTypes.UNSELECT,
  keyValue,
  data
});

/**
 * Action to unselect all items.
 */
export const unselectAll = () => ({
  type: actionTypes.UNSELECT_ALL
});

/**
 * Action to set a list filters.
 */
export const setFilters = (key, value) => ({
  type: actionTypes.SET_FILTERS,
  [key]: value
});

/**
 * Action to reorder the items.
 */
export const reorder = (startIndex, endIndex) => ({
  type: actionTypes.REORDER,
  startIndex,
  endIndex
});
