import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('telecomWorkgroups', 'dataLoaded', 'data');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('telecomWorkgroups', 'fetchingError', 'payload');

/**
 * Returns the workgroups data.
 */
export const getData = createGetItemsSelector(_getData);
