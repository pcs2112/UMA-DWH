import {
  createSelectAction,
  createSelectAllAction,
  createUnselectAction,
  createUnselectAllAction
} from '../../reducers/itemListSelectReducerFor';
import { createSetFilterAction } from '../../reducers/itemListFiltersReducerFor';
import { FILTERS_STATE_KEY_NAME } from './constants';

export const actionTypes = {
  FETCH_BEGIN: 'collegeScorecard/FETCH_BEGIN',
  FETCH_SUCCESS: 'collegeScorecard/FETCH_SUCCESS',
  FETCH_FAIL: 'collegeScorecard/FETCH_FAIL',
  RESET: 'collegeScorecard/RESET',
  SELECT: 'collegeScorecard/SELECT',
  SELECT_ALL: 'collegeScorecard/SELECT_ALL',
  UNSELECT: 'collegeScorecard/UNSELECT',
  UNSELECT_ALL: 'collegeScorecard/UNSELECT_ALL',
  SET_FILTER: 'collegeScorecard/SET_FILTER',
  SET_FILTERS: 'collegeScorecard/SET_FILTERS',
  REORDER: 'collegeScorecard/REORDER',
  LOAD_SAVED_REPORT: 'collegeScorecard/LOAD_SAVED_REPORT'
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

/**
 * Action to set a filter.
 */
export const setFilter = createSetFilterAction(actionTypes.SET_FILTER, FILTERS_STATE_KEY_NAME);

/**
 * Action to set filters.
 */
export const setFilters = createSetFilterAction(actionTypes.SET_FILTERS, FILTERS_STATE_KEY_NAME);

/**
 * Action to reorder the items.
 */
export const reorder = (startIndex, endIndex) => ({
  type: actionTypes.REORDER,
  startIndex,
  endIndex
});

/**
 * Action to load the college scorecard from a report.
 */
export const loadSavedReport = report => ({
  type: actionTypes.LOAD_SAVED_REPORT,
  report
});
