import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecardFormulas', 'dataLoaded', 'data');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecardFormulas', 'fetchingError', 'payload');

/**
 * Returns the college scorecard formulas data from the state.
 */
export const getCollegeScorecardFormulas = createSelector(
  [_getData],
  data => data
);
