import {
  createDataSelector,
  createFetchingErrorSelector,
  createGetItemsSelector
} from 'javascript-utils/lib/selectors';

const _getData = createDataSelector('telecomRoles', 'dataLoaded', 'data');

/**
 * Returns the error from the state.
 * @param {Object} state
 */
export const getFetchingError = createFetchingErrorSelector('telecomRoles', 'fetchingError', 'payload');

/**
 * Returns the roles data.
 */
export const getData = createGetItemsSelector(_getData);
