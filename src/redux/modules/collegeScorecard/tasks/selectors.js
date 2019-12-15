import { createSelector } from 'reselect';
import {
  createDataSelector,
  createFetchingErrorSelector,
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('collegeScorecardTasks', 'dataLoaded', 'data');

/**
 * Returns the fetching error.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('collegeScorecardTasks', 'fetchingError', 'payload');

/**
 * Returns the college scorecard tasks from the state.
 */
export const getTasksData = createSelector(
  [_getData],
  data => data
);
