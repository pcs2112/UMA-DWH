import { createSelector } from 'reselect';
import {
  createDataSelector,
  createGetItemsSelector,
  createGetPropertySelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecard', 'dataLoaded', 'data');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecard', 'fetchingError', 'payload');

/**
 * Returns the college scorecard data from the state.
 */
export const getCollegeScorecardData = createGetItemsSelector(_getData);

/**
 * Returns the selected items.
 * @param {Object} state
 */
export const getSelected = createGetPropertySelector('collegeScorecard', 'selected');

/**
 * Selector to get the total count of selected items.
 */
export const getSelectedCount = createSelector(
  [getSelected],
  selected => Object.keys(selected).length
);
