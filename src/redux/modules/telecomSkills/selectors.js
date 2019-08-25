import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('errorTypeResolution', 'dataLoaded', 'data');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('errorTypeResolution', 'fetchingError', 'payload');

/**
 * Returns the Error type resolution data.
 */
export const getFiles = createGetItemsSelector(_getData);
