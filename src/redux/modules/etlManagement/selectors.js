import {
  createDataSelector, createFetchingErrorSelector, createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('etlManagement', 'dataLoaded', 'data');

/**
 * Returns the fetching error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('etlManagement', 'fetchingError', 'payload');

/**
 * Returns the ETL management data from the state.
 */
export const getData = createGetItemsSelector(_getData);
