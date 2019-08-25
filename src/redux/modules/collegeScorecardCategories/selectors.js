import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecardCategories', 'dataLoaded', 'data');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecardCategories', 'fetchingError', 'payload');

/**
 * Returns the college scorecard categories data from the state.
 */
export const getCollegeScorecardCategories = createSelector(
  [_getData],
  data => data
);
