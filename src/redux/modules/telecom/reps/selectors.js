import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('telecomReps', 'dataLoaded', 'data');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('telecomReps', 'fetchingError', 'payload');

/**
 * Returns the reps data.
 */
export const getData = createGetItemsSelector(_getData);
