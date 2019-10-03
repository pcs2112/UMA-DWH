import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('dataLakeEntries', 'dataLoaded', 'data');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('dataLakeEntries', 'fetchingError', 'payload');

/**
 * Returns the entries data.
 */
export const getData = createGetItemsSelector(_getData);
