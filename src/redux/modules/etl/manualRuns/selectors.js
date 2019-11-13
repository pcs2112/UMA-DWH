import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('etlManualRuns', 'dataLoaded', 'data');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlManualRuns', 'fetchingError', 'payload');

/**
 * Returns the manual runs data.
 */
export const getData = createSelector(
  [_getData],
  (data) => data
);
