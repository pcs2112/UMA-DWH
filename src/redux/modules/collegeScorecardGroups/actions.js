import {
  createSelectAction,
  createSelectAllAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../reducers/itemListSelectReducerFor';

export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecardGroups/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecardGroups/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecardGroups/FETCH_FAIL',
  RESET: 'collegeScorecardGroups/RESET',
  SELECT: 'collegeScorecardGroups/SELECT',
  SELECT_ALL: 'collegeScorecardGroups/SELECT_ALL',
  UNSELECT: 'collegeScorecardGroups/UNSELECT',
  UNSELECT_ALL: 'collegeScorecardGroups/UNSELECT_ALL'
};

/**
 * Action to fetch the College scorecard group data.
 */
export const fetch = (fileName, group = 'ALL') => ({
  types: [
    actionTypes.FETCH_BEGIN,
    actionTypes.FETCH_SUCCESS,
    actionTypes.FETCH_FAIL
  ],
  makeRequest: client => client.get('/api/college_scorecard/data/summary', {
    params: {
      mode: 'SUMMARY',
      filename: fileName,
      group
    }
  }),
  payload: {
    fileName,
    group
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
export const select = createSelectAction(actionTypes.SELECT);

/**
 * Action to select all items.
 */
export const selectAll = createSelectAllAction(actionTypes.SELECT_ALL);


/**
 * Action to unselect an item.
 */
export const unselect = createUnselectAction(actionTypes.UNSELECT);

/**
 * Action to unselect all items.
 */
export const unselectAll = createUnselectAllAction(actionTypes.UNSELECT_ALL);
